const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    MASACH: {
        type: String,
        required: true,
        unique: true,
    },
    TENSACH: {
        type: String,
        required: true,
    },
    DONGIA: {
        type: Number,
        required: true,
    },
    SOQUYEN: {
        type: Number,
        required: true,
    },
    NAMXUATBAN: {
        type: Number,
        required: true,
    },
    MANXB: {
        type: String,
        ref: 'NHAXUATBAN',
        required: true,
    },
    TACGIA: {
        type: String,
        required: true,
    },
    HINHANH: {  
        type: String,
        required: false,
    },
    THELOAI: { 
        type: String,
        required: false,
    }
}, { collection: "SACH" });

module.exports = mongoose.model('SACH', bookSchema);