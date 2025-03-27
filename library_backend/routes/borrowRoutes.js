const express = require("express");
const BorrowController = require("../controllers/borrowController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/")
    .get(authMiddleware, BorrowController.getBorrowedBooks)  // Lấy danh sách sách đã mượn
    .post(authMiddleware, BorrowController.borrowBook);  // Người dùng yêu cầu mượn sách

router.route("/:id")
    .put(authMiddleware, BorrowController.confirmBorrow)  // Duyệt mượn sách
    .delete(authMiddleware, BorrowController.deleteBorrow); // Xóa yêu cầu mượn

router.route("/return/:id")
    .put(authMiddleware, BorrowController.returnBook);  // Xác nhận trả sách

router.route("/history")
    .get(authMiddleware, BorrowController.getUserBorrowHistory);    
module.exports = router;
