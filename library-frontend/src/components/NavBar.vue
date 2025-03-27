<template>
  <nav class="navbar navbar-expand-lg navbar-dark custom-navbar shadow-sm">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/"
        >Thư Viện Online</router-link
      >

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Mượn sách</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/history"
            >Lịch Sử Mượn Sách</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/profile">Profile</router-link>
        </li>
      </ul>

      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <button class="btn btn-outline-light fw-bold mx-2" @click="logout">
          Đăng Xuất
        </button>
        <div v-if="reader" class="d-flex align-items-center">
          <img
            :src="reader.avatar || defaultAvatar"
            alt="Avatar"
            class="reader-avatar"
          />
          <span class="fw-bold mx-2">{{ reader.HoLot }} {{ reader.Ten }}</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from "axios";
import defaultAvatar from "@/assets/avatar.png";

export default {
  data() {
    return {
      reader: null,
      defaultAvatar,
    };
  },
  methods: {
    async fetchUser() {
      try {
        const response = await axios.get("/api/readers/profile", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        this.reader = response.data;
      } catch (error) {
        console.error(
          "Lỗi khi lấy thông tin độc giả:",
          error.response?.data || error
        );
      }
    },
    logout() {
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    },
  },
  mounted() {
    this.fetchUser();
  },
};
</script>

<style scoped>
.custom-navbar {
  background-color: #81c784;
}

.navbar {
  padding: 1rem 0;
}

.reader-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid black;
}
</style>
