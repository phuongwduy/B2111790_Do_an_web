const mongoose = require("mongoose");

const NhanVienSchema = new mongoose.Schema({
  MSNV: { type: String, unique: true, required: true }, 
  HoTenNV: { type: String, required: true },
  Password: { type: String, required: true },
  ChucVu: { type: String, required: true },
  DiaChi: { type: String, required: true },
  SoDienThoai: { type: String, required: true },
}
, { collection: "NHANVIEN" }
);

module.exports = mongoose.model("NhanVien", NhanVienSchema);
