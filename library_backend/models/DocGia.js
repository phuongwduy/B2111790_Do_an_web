const mongoose = require("mongoose");

const DocGiaSchema = new mongoose.Schema({
  MADOCGIA: { type: String, unique: true, required: true },
  HoLot: { type: String, required: true },
  Ten: { type: String, required: true },
  NgaySinh: { type: Date, required: true },
  Phai: { type: String, enum: ["Nam", "Nữ"], required: true },
  DiaChi: { type: String, required: true },
  DienThoai: { type: String, required: true },
  Password: { type: String, required: true },
  avatar: { type: String, default: "" },
},
 { collection: "DOCGIA" }
);

module.exports = mongoose.model("DocGia", DocGiaSchema);
