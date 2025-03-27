<template>
  <div
    class="container vh-100 d-flex justify-content-center align-items-center"
  >
    <div class="card shadow-lg p-4" style="width: 100%; max-width: 400px">
      <h2 class="text-center mb-4 text-primary">Đăng nhập</h2>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label">Số điện thoại</label>
          <input
            v-model="form.SoDienThoai"
            type="text"
            class="form-control form-control-lg"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <input
            v-model="form.Password"
            type="password"
            class="form-control form-control-lg"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary btn-lg w-100">
          Đăng nhập
        </button>

        <p class="text-center mt-3">
          <router-link to="/register" class="text-decoration-none text-primary">
            Chưa có tài khoản? <strong>Đăng ký</strong>
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
        SoDienThoai: "",
        Password: "",
      },
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post("/api/auth/login", this.form);

        console.log("Dữ liệu API trả về:", response.data);

        alert(response.data.message);

        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("role", response.data.role);

        if (response.data.role === "NhanVien") {
          this.$router.push("/books");
        } else if (response.data.role === "DocGia") {
          this.$router.push("/borrowbooks");
        } else {
          console.warn("Không xác định được role:", response.data.role);
        }
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi server!");
      }
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 12px;
  background: #f0f0f0;
}
</style>
