<template>
  <div class="container-fluid mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="text-primary fw-bold mb-0">Quản lý Mượn Sách</h2>

      <div class="input-group w-50">
        <input
          type="text"
          class="form-control"
          placeholder="Tìm kiếm theo Mã Độc Giả hoặc Mã Sách..."
          v-model="searchQuery"
        />
        <span class="input-group-text"><i class="bi bi-search"></i></span>
      </div>
    </div>

    <!-- Bảng hiển thị danh sách mượn sách -->
    <div class="table-responsive">
      <table class="table table-bordered table-hover mt-3 shadow-sm">
        <thead class="bg-primary text-white">
          <tr class="text-center">
            <th>STT</th>
            <th>Mã Độc Giả</th>
            <th>Mã Sách</th>
            <th>Ngày Mượn</th>
            <th>Ngày Trả</th>
            <th>Trạng Thái</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(borrow, index) in paginatedBorrows"
            :key="borrow._id"
            class="text-center align-middle"
          >
            <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
            <td>{{ borrow.MADOCGIA || "N/A" }}</td>
            <td>{{ borrow.MASACH || "N/A" }}</td>
            <td>{{ formatDate(borrow.NGAYMUON) }}</td>
            <td>
              {{ borrow.NGAYTRA ? formatDate(borrow.NGAYTRA) : "Chưa trả" }}
            </td>
            <td>
              <span class="badge" :class="getStatusClass(borrow.TRANGTHAI)">
                {{ getStatusLabel(borrow.TRANGTHAI) }}
              </span>
            </td>
            <td class="d-flex justify-content-center gap-3">
              <button
                v-if="borrow.TRANGTHAI === 'CHOXACNHAN'"
                class="btn btn-warning btn-sm custom-btn"
                @click="$emit('confirm-borrow', borrow._id)"
              >
                <i class="bi bi-check-lg me-2"></i> Xác Nhận
              </button>
              <button
                v-if="borrow.TRANGTHAI === 'DANGMUON'"
                class="btn btn-info btn-sm custom-btn"
                @click="$emit('return-book', borrow._id)"
              >
                <i class="bi bi-arrow-return-left me-2"></i> Trả Sách
              </button>
              <button
                class="btn btn-danger btn-sm custom-btn"
                @click="$emit('delete-borrow', borrow._id)"
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
  props: {
    borrows: Array,
  },
  data() {
    return {
      itemsPerPage: 6, // Số mục trên mỗi trang
      currentPage: 1, // Trang hiện tại
      searchQuery: "", // Tìm kiếm
    };
  },
  computed: {
    filteredBorrows() {
      if (!this.searchQuery) {
        return this.borrows;
      }
      const query = this.searchQuery.toLowerCase();
      return this.borrows.filter(
        (borrow) =>
          borrow.MADOCGIA?.toLowerCase().includes(query) ||
          borrow.MASACH?.toLowerCase().includes(query)
      );
    },
    paginatedBorrows() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredBorrows.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredBorrows.length / this.itemsPerPage);
    },
  },
  methods: {
    formatDate(date) {
      return date ? new Date(date).toLocaleDateString("vi-VN") : "N/A";
    },
    getStatusLabel(status) {
      return (
        {
          CHOXACNHAN: "Chờ xác nhận",
          DANGMUON: "Đang mượn",
          DATRA: "Đã trả",
        }[status] || "Không xác định"
      );
    },
    getStatusClass(status) {
      return (
        {
          CHOXACNHAN: "bg-warning",
          DANGMUON: "bg-success",
          DATRA: "bg-secondary",
        }[status] || "bg-light"
      );
    },
    changePage(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style scoped>
@import "@/assets/styles.css";
</style>
