const NhaXuatBan = require("../models/publisher");
const Book = require("../models/bookModel");
// Lấy danh sách nhà xuất bản
exports.getAllNXB = async (req, res) => {
  try {
    const list = await NhaXuatBan.find();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Thêm nhà xuất bản mới
exports.createNXB = async (req, res) => {
  try {
    const { TENNXB, DIACHI } = req.body;

    // Lấy số lượng nhà xuất bản hiện có
    const count = await NhaXuatBan.countDocuments();

    // Tạo MANXB tự động (NXB001, NXB002, ...)
    const newMANXB = `NXB${String(count + 1).padStart(3, "0")}`;

    const newNXB = new NhaXuatBan({ MANXB: newMANXB, TENNXB, DIACHI });
    await newNXB.save();

    res.status(201).json({ message: "Thêm thành công!", newNXB });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
exports.getNXBById = async (req, res) => {
  try {
    const publisher = await NhaXuatBan.findById(req.params.id);
    if (!publisher) return res.status(404).json({ error: "NXB không tồn tại" });
    res.status(200).json(publisher);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin NXB" });
  }
};
// Cập nhật thông tin nhà xuất bản
exports.updateNXB = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNXB = await NhaXuatBan.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedNXB) {
      return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });
    }

    res.json({ message: "Cập nhật thành công!", updatedNXB });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Xóa nhà xuất bản

exports.deleteNXB = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy thông tin NXB để tìm MANXB
    const publisher = await NhaXuatBan.findById(id);
    if (!publisher) {
      return res.status(404).json({ message: "Không tìm thấy nhà xuất bản." });
    }

    //  Kiểm tra xem có sách nào dùng MANXB này không
    const booksCount = await Book.countDocuments({ MANXB: publisher.MANXB });
    if (booksCount > 0) {
      return res.status(400).json({
        message: " Không thể xóa! Nhà xuất bản này có sách liên quan.",
      });
    }

    //  Nếu không có sách thì tiến hành xóa NXB
    await NhaXuatBan.findByIdAndDelete(id);
    res.json({ message: "Xóa thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};


