<template>
  <div class="container-fluid mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="text-primary fw-bold mb-0">Quản lý Nhân Viên</h2>
      <button class="btn btn-success custom-btn" @click="$emit('add')">
        <i class="bi bi-plus-lg me-2"></i> Thêm Nhân Viên
      </button>
      <div class="input-group w-50">
        <input
          type="text"
          class="form-control"
          placeholder="Tìm kiếm..."
          v-model="searchQuery"
        />
        <span class="input-group-text"><i class="bi bi-search"></i></span>
      </div>
    </div>

    <!-- Bảng hiển thị danh sách nhân viên -->
    <div class="table-responsive">
      <table class="table table-bordered table-hover mt-3 shadow-sm table-xxl">
        <thead class="bg-primary text-white">
          <tr class="text-center">
            <th>STT</th>
            <th class="w-15">Mã NV</th>
            <th class="w-20">Họ Tên</th>
            <th class="w-15">Chức Vụ</th>
            <th class="w-15">Số Điện Thoại</th>
            <th class="w-25">Địa Chỉ</th>
            <th class="w-20">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(staff, index) in paginatedStaff"
            :key="staff._id"
            class="text-center align-middle"
          >
            <td>{{ index + 1 + (currentPage - 1) * staffPerPage }}</td>
            <td>{{ staff.MSNV || "N/A" }}</td>
            <td>{{ staff.HoTenNV || "N/A" }}</td>
            <td>{{ staff.ChucVu || "N/A" }}</td>
            <td>{{ staff.SoDienThoai || "N/A" }}</td>
            <td>{{ staff.DiaChi || "N/A" }}</td>
            <td class="d-flex justify-content-center gap-3">
              <button
                class="btn btn-warning btn-sm custom-btn"
                @click="editStaff(staff._id)"
              >
                <i class="bi bi-pencil-square me-2"></i> Sửa
              </button>
              <button
                class="btn btn-danger btn-sm custom-btn"
                @click="deleteStaff(staff._id)"
              >
                <i class="bi bi-trash me-2"></i> Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <nav>
      <ul class="pagination justify-content-center mt-3">
        <li class="page-item" v-for="page in totalPages" :key="page">
          <button
            class="page-link"
            :class="{ active: page === currentPage }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  props: ["staffList"],
  data() {
    return {
      staffPerPage: 6, // Số nhân viên trên mỗi trang
      currentPage: 1, // Trang hiện tại
      searchQuery: "",
    };
  },
  computed: {
    filteredStaff() {
      return this.staffList.filter((staff) => {
        const query = this.searchQuery.toLowerCase();
        return (
          staff.HoTenNV.toLowerCase().includes(query) ||
          staff.MSNV.toLowerCase().includes(query) ||
          staff.SoDienThoai.includes(query) ||
          staff.ChucVu.toLowerCase().includes(query)
        );
      });
    },
    paginatedStaff() {
      const start = (this.currentPage - 1) * this.staffPerPage;
      const end = start + this.staffPerPage;
      return this.filteredStaff.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredStaff.length / this.staffPerPage);
    },
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
    },
    editStaff(id) {
      this.$emit("edit", id);
    },
    deleteStaff(id) {
      this.$emit("delete", id);
    },
  },
};
</script>

<style scoped>
@import "@/assets/styles.css";
</style>
