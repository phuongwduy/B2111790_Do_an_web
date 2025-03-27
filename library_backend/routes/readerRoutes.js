const express = require("express");
const readerController = require("../controllers/readerController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.route("/")
    .get(readerController.getAllReaders)  // Lấy danh sách độc giả
    .post(readerController.addReader);                    // Thêm độc giả mới

router.route("/:id")                 // Lấy thông tin độc giả theo                   // Cập nhật độc giả
    .delete(readerController.deleteReader);               // Xóa độc giả
router.route("/profile")
    .get(authMiddleware, readerController.getReaderById)
    .put(authMiddleware, readerController.updateProfile); 
router.route("/update-avatar")
.put( authMiddleware, readerController.updateAvatar);

module.exports = router;
