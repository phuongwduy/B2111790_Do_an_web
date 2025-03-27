<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
    aria-labelledby="addStaffLabel"
  >
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content shadow-lg rounded-3">
        <div class="modal-header bg-primary text-white">
          <h4 class="modal-title fw-bold" id="addStaffLabel">
            <i class="bi bi-person-plus"></i> Thêm Nhân Viên
          </h4>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>
        <div class="modal-body px-4 py-4">
          <form @submit.prevent="handleAddStaff">
            <div class="row g-4">
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  <i class="bi bi-person"></i> Họ và Tên</label
                >
                <input
                  v-model="form.HoTenNV"
                  type="text"
                  class="form-control"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  <i class="bi bi-key"></i> Mật khẩu</label
                >
                <input
                  v-model="form.Password"
                  type="password"
                  class="form-control"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>
            </div>

            <div class="row g-3 mt-2">
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  <i class="bi bi-briefcase"></i> Chức vụ</label
                >
                <input
                  v-model="form.ChucVu"
                  type="text"
                  class="form-control"
                  placeholder="Nhập chức vụ"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  <i class="bi bi-geo-alt"></i> Địa chỉ</label
                >
                <input
                  v-model="form.DiaChi"
                  type="text"
                  class="form-control"
                  placeholder="Nhập địa chỉ"
                  required
                />
              </div>
            </div>

            <div class="row g-3 mt-2">
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  <i class="bi bi-telephone"></i> Số điện thoại</label
                >
                <input
                  v-model="form.SoDienThoai"
                  type="text"
                  class="form-control"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
            </div>

            <div class="modal-footer mt-3">
              <button
                type="button"
                class="btn btn-secondary custom-btn"
                @click="$emit('close')"
              >
                <i class="bi bi-x-circle me-2"></i> Hủy
              </button>
              <button type="submit" class="btn btn-primary custom-btn">
                <i class="bi bi-check-circle me-2"></i> Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div class="modal-backdrop fade show" v-if="visible"></div>
</template>

<script>
import axios from "axios";

export default {
  emits: ["close", "added"],
  data() {
    return {
      visible: true,
      form: {
        HoTenNV: "",
        Password: "",
        ChucVu: "",
        DiaChi: "",
        SoDienThoai: "",
        Role: "NhanVien",
      },
    };
  },
  methods: {
    async handleAddStaff() {
      try {
        const response = await axios.post("/api/staffs", this.form);
        alert(response.data.message);
        this.$emit("added");
        this.$emit("close");
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi server!");
      }
    },
  },
};
</script>

<style scoped>
.modal-content {
  border-radius: 12px;
  overflow: hidden;
}

.modal-header {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.form-label {
  font-weight: 600;
}

.btn {
  border-radius: 8px;
  transition: 0.3s;
}

.btn:hover {
  transform: scale(1.05);
}

.custom-btn {
  font-size: 1rem;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-btn:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.custom-btn:active {
  transform: scale(0.98);
  box-shadow: none;
}

.custom-btn i {
  font-size: 1.2rem;
}
</style>
