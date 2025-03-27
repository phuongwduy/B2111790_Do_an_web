<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h5>📂 Quản Lý Thư Viện</h5>
    </div>
    <div class="sidebar-content">
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link class="nav-link" to="/books">
            <i class="bi bi-book"></i> Quản lý Sách
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/publishers">
            <i class="bi bi-pencil-square"></i> Quản lý Nhà xuất bản
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/borrower">
            <i class="bi bi-person-lines-fill"></i> Quản lý Người Mượn
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/readers">
            <i class="bi bi-person-lines-fill"></i> Quản lý Độc Giả
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/staffs">
            <i class="bi bi-person-lines-fill"></i> Quản lý Nhân Viên
          </router-link>
        </li>
      </ul>
      <div class="nav-item logout-item">
        <hr class="sidebar-divider" />
        <a class="nav-link logout" href="#" @click="logout">
          <i class="bi bi-box-arrow-right"></i> Đăng Xuất
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #0a74da;
  padding: 20px;
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
}

.sidebar-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.nav {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.nav-link {
  color: white;
  font-size: 16px;
  padding: 12px;
  display: flex;
  align-items: center;
  transition: 0.3s;
  border-radius: 5px;
}

.nav-link i {
  margin-right: 10px;
  font-size: 18px;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

.sidebar-divider {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  margin: 10px;
}
</style>
<script>
export default {
  methods: {
    logout() {
      sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>
