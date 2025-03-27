const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NhanVien = require("../models/NhanVien");
const DocGia = require("../models/DocGia");

exports.register = async (req, res) => {
  try {
    const { HoTen, Password, DiaChi, SoDienThoai, NgaySinh, Phai } = req.body;

    if (!HoTen || !Password || !DiaChi || !SoDienThoai) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    const existingUser = await DocGia.findOne({ DienThoai: SoDienThoai });
    if (existingUser) {
      return res.status(400).json({ message: "Số điện thoại đã được sử dụng!" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    // Tách họ lót và tên
    const nameParts = HoTen.trim().split(" ");
    const HoLot = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : ""; // Họ lót
    const Ten = nameParts[nameParts.length - 1]; // Tên chính

    if (!HoLot) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ họ và tên!" });
    }
    const newDocGia = new DocGia({
      MADOCGIA: `DG${Date.now()}`,
      HoLot,
      Ten,
      NgaySinh,
      Phai,
      DiaChi,
      DienThoai: SoDienThoai,
      Password: hashedPassword,
      Role: "DocGia",
    });

    await newDocGia.save();
    return res.status(201).json({ message: "Đăng ký độc giả thành công!" });

  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};



// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { SoDienThoai, Password } = req.body;

    if (!SoDienThoai || !Password) {
      return res.status(400).json({ message: "Vui lòng nhập số điện thoại và mật khẩu!" });
    }

    let user = await NhanVien.findOne({ SoDienThoai });
    let role = "NhanVien";

    if (!user) {
      user = await DocGia.findOne({ DienThoai: SoDienThoai });
      role = "DocGia";
    }

    if (!user) {
      return res.status(401).json({ message: "Số điện thoại không tồn tại!" });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không chính xác!" });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user._id, SoDienThoai, role, MADOCGIA: user.MADOCGIA },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );
    
    // Gửi token về client để lưu vào localStorage
    res.json({ message: "Đăng nhập thành công!", token, role });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server! Vui lòng thử lại." });
  }
};
