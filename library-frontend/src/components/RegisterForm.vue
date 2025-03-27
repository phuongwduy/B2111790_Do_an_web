<template>
  <div
    class="container vh-100 d-flex justify-content-center align-items-center"
  >
    <div class="card shadow-lg p-4" style="width: 60%; max-width: 450px">
      <h2 class="text-center mb-4 text-primary">Đăng ký</h2>

      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label class="form-label">Số điện thoại</label>
          <input
            v-model="form.SoDienThoai"
            type="text"
            class="form-control form-control-lg custom-input"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <input
            v-model="form.Password"
            type="password"
            class="form-control form-control-lg custom-input"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Họ và Tên</label>
          <input
            v-model="form.HoTen"
            type="text"
            class="form-control form-control-lg custom-input"
            placeholder="Nhập họ và tên"
            required
          />
        </div>

        <!-- Phái -->
        <div class="mb-3">
          <label class="form-label">Phái</label>
          <select
            v-model="form.Phai"
            class="form-select custom-dropdown mx-3"
            required
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>

        <!-- Ngày sinh -->
        <div class="mb-3">
          <label class="form-label">Ngày sinh</label>
          <input
            v-model="form.NgaySinh"
            type="date"
            class="form-control form-control-lg custom-input"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Địa chỉ</label>
          <input
            v-model="form.DiaChi"
            type="text"
            class="form-control form-control-lg custom-input"
            placeholder="Nhập địa chỉ"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary btn-lg w-100">
          Đăng ký
        </button>

        <p class="text-center mt-3">
          <router-link to="/login" class="text-decoration-none text-primary">
            Đã có tài khoản? <strong>Đăng nhập</strong>
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      form: {
        HoTen: "",
        Password: "",
        DiaChi: "",
        SoDienThoai: "",
        Phai: "Nam",
        NgaySinh: "",
      },
    };
  },
  methods: {
    async handleRegister() {
      try {
        const response = await axios.post("/api/auth/register", {
          ...this.form,
          Role: "DocGia",
        });

        alert(response.data.message);
        this.$router.push("/login");
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi server!");
      }
    },
  },
};
</script>

<style scoped>
.custom-dropdown {
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 10px;
  transition: all 0.3s ease;
}

.custom-dropdown:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.card {
  border-radius: 12px;
  background: #f0f0f0;
}
</style>
