const Reader = require("../models/DocGia");
const Borrow = require("../models/borrow");

// Lấy danh sách độc giả
exports.getAllReaders = async (req, res) => {
  try {
    const readers = await Reader.find();
    res.status(200).json(readers);
  } catch (error) {
    res.status(500).json({ error: "Server error!" });
  }
};

const jwt = require("jsonwebtoken");

exports.getReaderById = async (req, res) => {
  try {
    const { MADOCGIA } = req.user;
    const reader = await Reader.findOne({ MADOCGIA}).select("-Password");
    if (!reader) {
      return res.status(404).json({ error: "Không tìm thấy độc giả!" });
    }

    res.json(reader);
  } catch (err) {
    console.error("Lỗi server:", err);
    res.status(500).json({ error: "Lỗi server!" });
  }
};


// Thêm độc giả mới
exports.addReader = async (req, res) => {
  try {
    const newReader = new Reader(req.body);
    await newReader.save();
    res.status(201).json(newReader);
  } catch (error) {
    res.status(400).json({ error: "Failed to add reader!" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { MADOCGIA } = req.user; // Lấy mã độc giả từ token
    const { HoLot, Ten, NgaySinh, Phai, DiaChi, DienThoai } = req.body;

    const updateData = { HoLot, Ten, NgaySinh, Phai, DiaChi, DienThoai };

    const reader = await Reader.findOneAndUpdate(
      { MADOCGIA },
      updateData,
      { new: true } // Trả về dữ liệu mới sau khi cập nhật
    );

    if (!reader) return res.status(404).json({ message: "Không tìm thấy độc giả!" });

    res.json({ message: "Cập nhật thành công!", reader });
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};



exports.deleteReader = async (req, res) => {
  try {
    const { id } = req.params;

    const reader = await Reader.findById(id);
    if (!reader) {
      return res.status(404).json({ message: "Không tìm thấy độc giả!" });
    }

    const activeBorrow = await Borrow.findOne({
      MADOCGIA: reader.MADOCGIA,
      TRANGTHAI: "DANGMUON"    
    });

    if (activeBorrow) {
      return res.status(400).json({ message: "Không thể xóa độc giả vì đang mượn sách!" });
    }

    // Xóa độc giả nếu không có sách đang mượn
    await Reader.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa độc giả thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa độc giả", error });
  }
};


exports.updateAvatar = async (req, res) => {
  try {
    const { avatarUrl } = req.body;
    const { MADOCGIA } = req.user;

    if (!MADOCGIA) {
      return res.status(401).json({ message: "Người dùng chưa được xác thực" });
    }

    if (!avatarUrl || typeof avatarUrl !== "string") {
      return res.status(400).json({ message: "Vui lòng chọn ảnh đại diện hợp lệ" });
    }

    const reader = await Reader.findOneAndUpdate(
      { MADOCGIA },
      { avatar: avatarUrl },
      { new: true }
    );

    if (!reader) {
      return res.status(404).json({ message: "Không tìm thấy độc giả" });
    }

    res.json({
      message: "Cập nhật avatar thành công",
      reader, // Trả về toàn bộ thông tin sau khi cập nhật
    });
  } catch (error) {
    console.error("Lỗi cập nhật avatar:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
