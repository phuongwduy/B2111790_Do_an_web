const mongoose = require("mongoose");

const BorrowSchema = new mongoose.Schema(
  {
    MADOCGIA: { type: String, ref: "DOCGIA", required: true },
    MASACH: { type: String, ref: "SACH", required: true },
    NGAYMUON: { type: Date, default: Date.now },
    NGAYTRA: { type: Date },
    TRANGTHAI: { 
      type: String, 
      enum: ["CHOXACNHAN", "DANGMUON", "DATRA"], 
      default: "CHOXACNHAN"
    }
  },
  { collection: "THEODOIMUONSACH" }
);

module.exports = mongoose.model("THEODOIMUONSACH", BorrowSchema);
