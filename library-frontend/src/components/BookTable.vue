<template>
  <div class="container-fluid mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="text-primary fw-bold mb-0">Quản lý Sách</h2>
      <button class="btn btn-success custom-btn" @click="$emit('add')">
        <i class="bi bi-plus-lg me-2"></i> Thêm Sách
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

    <!-- Bảng hiển thị danh sách sách -->
    <div class="table-responsive">
      <table class="table table-bordered table-hover mt-3 shadow-sm table-xxl">
        <thead class="bg-primary text-white">
          <tr class="text-center">
            <th>STT</th>
            <th class="w-10">Mã Sách</th>
            <th class="w-20">Tên Sách</th>
            <th class="w-15">Giá</th>
            <th class="w-10">Số Lượng</th>
            <th class="w-15">Tác Giả</th>
            <th class="w-15">Nhà Xuất Bản</th>
            <th class="w-20">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(book, index) in paginatedBooks"
            :key="book._id"
            class="text-center align-middle"
          >
            <td>{{ index + 1 + (currentPage - 1) * booksPerPage }}</td>
            <td>{{ book.MASACH || "N/A" }}</td>
            <td>{{ book.TENSACH || "N/A" }}</td>
            <td>
              {{ book.DONGIA ? book.DONGIA.toLocaleString() + " VNĐ" : "N/A" }}
            </td>
            <td>{{ book.SOQUYEN || "N/A" }}</td>
            <td>{{ book.TACGIA || "N/A" }}</td>
            <td>{{ book.MANXB || "N/A" }}</td>
            <td class="d-flex justify-content-center gap-3">
              <button
                class="btn btn-warning btn-sm custom-btn"
                @click="editBook(book._id)"
              >
                <i class="bi bi-pencil-square me-2"></i> Sửa
              </button>
              <button
                class="btn btn-danger btn-sm custom-btn"
                @click="deleteBook(book._id)"
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
  props: ["books"],
  data() {
    return {
      booksPerPage: 6, // Số sách trên mỗi trang
      currentPage: 1, // Trang hiện tại
      searchQuery: "", // Tìm kiếm theo tên sách
    };
  },
  computed: {
    filteredBooks() {
      return this.books.filter((book) => {
        const query = this.searchQuery.toLowerCase();
        return (
          book.TENSACH.toLowerCase().includes(query) ||
          book.MASACH.toLowerCase().includes(query) ||
          book.MANXB.toLowerCase().includes(query) ||
          book.TACGIA.toLowerCase().includes(query)
        );
      });
    },
    paginatedBooks() {
      const start = (this.currentPage - 1) * this.booksPerPage;
      const end = start + this.booksPerPage;
      return this.filteredBooks.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.booksPerPage);
    },
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
    },
    editBook(id) {
      this.$emit("edit", id);
    },
    deleteBook(id) {
      this.$emit("delete", id);
    },
  },
};
</script>

<style scoped>
@import "@/assets/styles.css";
</style>
