const express = require("express");
const staffController = require("../controllers/staffController.js");

const router = express.Router();

router.route("/")
    .get(staffController.getAllStaff)    // Lấy danh sách nhân viên
    .post(staffController.createStaff);  // Thêm nhân viên mới

router.route("/:id")
    .get(staffController.getStaffById)   // Lấy thông tin nhân viên theo ID
    .put(staffController.updateStaff)    // Cập nhật nhân viên
    .delete(staffController.deleteStaff); // Xóa nhân viên

module.exports = router;
