const NhanVien = require("../models/NhanVien");
const bcrypt = require("bcryptjs");
// Lấy danh sách tất cả nhân viên
exports.getAllStaff = async (req, res) => {
  try {
    const staffList = await NhanVien.find();
    res.status(200).json(staffList);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách nhân viên", error });
  }
};

// Lấy thông tin một nhân viên theo ID
exports.getStaffById = async (req, res) => {
  try {
    const staff = await NhanVien.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin nhân viên", error });
  }
};


exports.createStaff = async (req, res) => {
  try {
    const { HoTenNV, Password, ChucVu, DiaChi, SoDienThoai } = req.body;

    // Kiểm tra nếu thiếu dữ liệu bắt buộc
    if (!HoTenNV || !Password || !ChucVu || !DiaChi || !SoDienThoai) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    // Lấy MSNV lớn nhất trong DB và tăng lên 1
    const lastStaff = await NhanVien.findOne().sort({ MSNV: -1 }).lean();
    let newMSNV = "NV001";
    if (lastStaff && lastStaff.MSNV) {
      const lastNumber = parseInt(lastStaff.MSNV.replace("NV", ""), 10);
      newMSNV = `NV${String(lastNumber + 1).padStart(3, "0")}`;
    }
    const hashedPassword = await bcrypt.hash(Password, 10);
    // Tạo nhân viên mới
    const newStaff = new NhanVien({
      MSNV: newMSNV,
      HoTenNV,
      Password: hashedPassword,
      ChucVu,
      DiaChi,
      SoDienThoai,
      Role: "NhanVien",
    });

    await newStaff.save();
    res.status(201).json({ message: "Thêm nhân viên thành công", newStaff });
  } catch (error) {
    console.error("Lỗi khi thêm nhân viên:", error); // In lỗi ra terminal
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};



// Cập nhật thông tin nhân viên
exports.updateStaff = async (req, res) => {
  try {
    const updatedStaff = await NhanVien.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedStaff) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    res.status(200).json({ message: "Cập nhật nhân viên thành công", updatedStaff });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật nhân viên", error });
  }
};

// Xóa nhân viên theo ID
exports.deleteStaff = async (req, res) => {
  try {
    const deletedStaff = await NhanVien.findByIdAndDelete(req.params.id);

    if (!deletedStaff) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên để xóa" });
    }

    res.status(200).json({ message: "Xóa nhân viên thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa nhân viên", error });
  }
};
