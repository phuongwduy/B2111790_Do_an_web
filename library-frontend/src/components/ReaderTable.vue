<template>
  <div class="container-fluid mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="text-primary fw-bold mb-0">Quản lý Độc Giả</h2>

      <!-- Thanh tìm kiếm -->
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

    <!-- Bảng hiển thị danh sách độc giả -->
    <div class="table-responsive">
      <table class="table table-bordered table-hover mt-3 shadow-sm table-xxl">
        <thead class="bg-primary text-white">
          <tr class="text-center">
            <th>STT</th>
            <th class="w-15">Mã Độc Giả</th>
            <th class="w-20">Họ & Tên</th>
            <th class="w-15">Ngày sinh</th>
            <th class="w-10">Giới tính</th>
            <th class="w-25">Địa chỉ</th>
            <th class="w-15">Số điện thoại</th>
            <th class="w-15">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(reader, index) in paginatedReaders"
            :key="reader._id"
            class="text-center align-middle"
          >
            <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
            <td>{{ reader.MADOCGIA || "N/A" }}</td>
            <td>{{ reader.HoLot }} {{ reader.Ten }}</td>
            <td>{{ new Date(reader.NgaySinh).toLocaleDateString() }}</td>
            <td>{{ reader.Phai }}</td>
            <td>{{ reader.DiaChi || "N/A" }}</td>
            <td>{{ reader.DienThoai || "N/A" }}</td>
            <td class="d-flex justify-content-center gap-3">
              <button
                class="btn btn-danger btn-sm custom-btn"
                @click="deleteReader(reader._id)"
              >
                <i class="bi bi-trash me-2"></i> Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PHÂN TRANG -->
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
  props: ["readers"],
  data() {
    return {
      itemsPerPage: 6, // Số độc giả trên mỗi trang
      currentPage: 1, // Trang hiện tại
      searchQuery: "",
    };
  },
  computed: {
    filteredReaders() {
      return this.readers.filter((reader) => {
        const query = this.searchQuery.toLowerCase();
        return (
          reader.MADOCGIA.toLowerCase().includes(query) ||
          reader.HoLot.toLowerCase().includes(query) ||
          reader.Ten.toLowerCase().includes(query) ||
          reader.DiaChi.toLowerCase().includes(query) ||
          reader.DienThoai.toLowerCase().includes(query)
        );
      });
    },
    paginatedReaders() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredReaders.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredReaders.length / this.itemsPerPage);
    },
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
    },
    deleteReader(id) {
      this.$emit("delete", id);
    },
  },
};
</script>

<style scoped>
@import "@/assets/styles.css";
</style>
