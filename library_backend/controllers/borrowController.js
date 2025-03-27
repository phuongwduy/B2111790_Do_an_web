const Borrow = require('../models/borrow'); // Đảm bảo bạn import đúng model Borrow

// Lấy danh sách tất cả sách đã mượn
exports.getBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await Borrow.find();
    res.status(200).json(borrowedBooks);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

exports.borrowBook = async (req, res) => {
  try {
    const { MASACH } = req.body;
    const { MADOCGIA } = req.user; // Lấy từ token

    if (!MADOCGIA) {
      return res.status(400).json({ message: "Không tìm thấy MADOCGIA!" });
    }

    // Kiểm tra số lượng yêu cầu mượn sách trong trạng thái "CHOXACNHAN" hoặc "DANGMUON"
    const borrowCount = await Borrow.countDocuments({
      MADOCGIA,
      TRANGTHAI: { $in: ["CHOXACNHAN", "DANGMUON"] }
    });

    // Nếu người dùng đã mượn 3 cuốn sách, không cho phép mượn thêm
    if (borrowCount >= 3) {
      return res.status(400).json({ message: "Bạn chỉ có thể mượn tối đa 3 cuốn sách!" });
    }

    const bookRequestCount = await Borrow.countDocuments({
      MASACH,
      TRANGTHAI: "CHOXACNHAN", 
    });

    if (bookRequestCount >= 2) {
      return res.status(400).json({ message: "Cuốn sách này đã được mượn 2 lần, không thể mượn thêm!" });
    }

    // Tạo yêu cầu mượn sách mới
    const newBorrow = new Borrow({
      MADOCGIA,
      MASACH,
      TRANGTHAI: "CHOXACNHAN", 
    });

    await newBorrow.save();
    res.status(201).json({ message: "Yêu cầu mượn sách đã gửi!", newBorrow });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi mượn sách", error });
  }
};




const Book = require("../models/bookModel"); // Import model sách

exports.confirmBorrow = async (req, res) => {
  try {
    const { id } = req.params;

    const borrowRequest = await Borrow.findById(id);
    if (!borrowRequest) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu mượn!" });
    }

    if (borrowRequest.TRANGTHAI !== "CHOXACNHAN") {
      return res.status(400).json({ message: "Yêu cầu này đã được xử lý!" });
    }

    // Tìm sách trong cơ sở dữ liệu
    const book = await Book.findOne({ MASACH: borrowRequest.MASACH });
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách!" });
    }

    // Kiểm tra xem còn sách để mượn không
    if (book.SOQUYEN <= 0) {
      return res.status(400).json({ message: "Sách đã hết, không thể mượn!" });
    }

    // Giảm số lượng sách đi 1
    book.SOQUYEN -= 1;
    await book.save();

    // Cập nhật trạng thái mượn
    borrowRequest.TRANGTHAI = "DANGMUON";
    await borrowRequest.save();

    res.status(200).json({ message: "Mượn sách đã được duyệt!", borrowRequest });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi duyệt mượn sách", error });
  }
};


// Admin xác nhận trả sách -> Chuyển trạng thái từ "DANGMUON" thành "DATRA"
exports.returnBook = async (req, res) => {
  try {
    const { id } = req.params;

    const borrowRecord = await Borrow.findById(id);
    if (!borrowRecord) {
      return res.status(404).json({ message: "Không tìm thấy thông tin mượn!" });
    }

    if (borrowRecord.TRANGTHAI !== "DANGMUON") {
      return res.status(400).json({ message: "Sách chưa được mượn hoặc đã trả!" });
    }
    // Tìm sách trong cơ sở dữ liệu
    const book = await Book.findOne({ MASACH: borrowRecord.MASACH });
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách!" });
    }

    // Tăng số lượng sách lên 1
    book.SOQUYEN += 1;
    await book.save();
    borrowRecord.TRANGTHAI = "DATRA";
    borrowRecord.NGAYTRA = new Date();
    await borrowRecord.save();

    res.status(200).json({ message: "Xác nhận trả sách thành công!", borrowRecord });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi trả sách", error });
  }
};

// Xóa yêu cầu mượn sách
exports.deleteBorrow = async (req, res) => {
  try {
    const { id } = req.params;
    const borrowRecord = await Borrow.findById(id);

    // Kiểm tra nếu không tìm thấy yêu cầu mượn
    if (!borrowRecord) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu mượn!" });
    }

    // Nếu sách đang được mượn, không cho phép xóa
    if (borrowRecord.TRANGTHAI === "DANGMUON") {
      return res.status(400).json({ message: "Không thể xóa, sách đang được mượn!" });
    }

    // Nếu không phải trạng thái "DANGMUON" thì mới được xóa
    await Borrow.findByIdAndDelete(id);

    res.status(200).json({ message: "Yêu cầu mượn sách đã được xóa!", borrowRecord });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa yêu cầu mượn sách", error });
  }
};
exports.getUserBorrowHistory = async (req, res) => {
  try {
    const { MADOCGIA } = req.user;

    if (!MADOCGIA) {
      return res.status(400).json({ message: "Không tìm thấy MADOCGIA!" });
    }

    // Lấy lịch sử mượn
    const borrowHistory = await Borrow.find({ MADOCGIA });

    // Duyệt qua từng bản ghi mượn, tìm sách theo MASACH (String)
    const historyWithBookNames = await Promise.all(
      borrowHistory.map(async (borrow) => {
        const book = await Book.findOne({ MASACH: borrow.MASACH }); // Tìm theo MASACH (String)
        return {
          ...borrow._doc,  // Sao chép dữ liệu từ borrow
          TENSACH: book ? book.TENSACH : "Không tìm thấy", // Nếu có sách, lấy TENSACH
        };
      })
    );

    res.status(200).json({ history: historyWithBookNames });
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử mượn:", error);
    res.status(500).json({ message: "Lỗi khi lấy lịch sử mượn", error });
  }
};



