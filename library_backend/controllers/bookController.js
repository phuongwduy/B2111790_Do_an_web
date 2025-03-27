const Book = require('../models/bookModel');
const NhaXuatBan = require('../models/publisher');
const Borrow = require("../models/borrow");
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).send({ books });
    } catch (error) {
        res.status(500).send({ message: 'Không thể lấy sách từ cơ sở dữ liệu.' });
    }
}
exports.addBook = async (req, res) => {
    try {
        const { TENSACH, DONGIA, SOQUYEN, NAMXUATBAN, MANXB, TACGIA, HINHANH, THELOAI } = req.body;

        // Kiểm tra nếu thiếu thông tin bắt buộc
        if (!TENSACH || !DONGIA || !SOQUYEN || !NAMXUATBAN || !MANXB || !TACGIA) {
            return res.status(400).send({ message: "Vui lòng nhập đầy đủ thông tin sách!" });
        }

        // Kiểm tra nhà xuất bản có tồn tại không
        const existingNXB = await NhaXuatBan.findOne({ MANXB });
        if (!existingNXB) {
            return res.status(400).send({ message: "Nhà xuất bản không tồn tại!" });
        }

        // Tạo mã sách tự động (S001, S002, …)
        const bookCount = await Book.countDocuments();
        const MASACH = `S${String(bookCount + 1).padStart(3, "0")}`;

        // Tạo sách mới
        const newBook = new Book({
            MASACH,
            TENSACH,
            DONGIA,
            SOQUYEN,
            NAMXUATBAN,
            MANXB,
            TACGIA,
            HINHANH: HINHANH || "",
            THELOAI,
        });

        await newBook.save();
        res.status(201).send({ message: "Thêm sách thành công!", book: newBook });
    } catch (error) {
        console.error("Lỗi khi thêm sách:", error);
        res.status(500).send({ message: "Không thể thêm sách vào cơ sở dữ liệu.", error });
    }
};


exports.deleteBook = async (req, res) => { 
    try {
        const { id } = req.params;
    
        const book = await Book.findById(id);
        if (!book) {
          return res.status(404).json({ message: "Không tìm thấy sách!" });
        }
    
        const activeBorrow = await Borrow.findOne({
          MASACH: book.MASACH,
          TRANGTHAI: "DANGMUON", // Chỉ kiểm tra sách đang được mượn
        });
    
        if (activeBorrow) {
          return res.status(400).json({
            message: "Không thể xóa sách vì đang có người mượn!",
          });
        }
    
        await Book.findByIdAndDelete(id);
    
        res.status(200).json({ message: "Xóa sách thành công!" });
      } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa sách", error });
      }
    };

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Không tìm thấy sách" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByIdAndUpdate(id, req.body, { new: true });
        if (!book) {
            return res.status(404).send({ message: 'Không tìm thấy sách!' });
        }
        res.status(200).send({ book });
    }
    catch (error) {
        res.status(500).send({ message: 'Không thể cập nhật sách trong cơ sở dữ liệu.', error });
    }
}

exports.deleteAllBooks = async (req, res) => {
    try {
        await Book.deleteMany();
        res.status(200).send({ message: 'Xóa tất cả sách thành công!' });
    } catch (error) {
        console.error('Lỗi khi xóa tất cả sách:', error);
        res.status(500).send({ message: 'Không thể xóa tất cả sách khỏi cơ sở dữ liệu.', error });
    }
}
