<template>
  <div class="container-fluid mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="text-primary fw-bold mb-0">Quản lý Nhà Xuất Bản</h2>
      <button class="btn btn-success custom-btn" @click="$emit('add')">
        <i class="bi bi-plus-lg me-2"></i> Thêm NXB
      </button>
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

    <!-- Bảng hiển thị danh sách Nhà Xuất Bản -->
    <div class="table-responsive">
      <table class="table table-bordered table-hover mt-3 shadow-sm table-xxl">
        <thead class="bg-primary text-white">
          <tr class="text-center">
            <th>STT</th>
            <th class="w-20">Mã NXB</th>
            <th class="w-30">Tên Nhà Xuất Bản</th>
            <th class="w-30">Địa Chỉ</th>
            <th class="w-20">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(publisher, index) in paginatedPublishers"
            :key="publisher._id"
            class="text-center align-middle"
          >
            <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
            <td>{{ publisher.MANXB || "N/A" }}</td>
            <td>{{ publisher.TENNXB || "N/A" }}</td>
            <td>{{ publisher.DIACHI || "N/A" }}</td>
            <td class="d-flex justify-content-center gap-3">
              <button
                class="btn btn-warning btn-sm custom-btn"
                @click="editPublisher(publisher._id)"
              >
                <i class="bi bi-pencil-square me-2"></i> Sửa
              </button>
              <button
                class="btn btn-danger btn-sm custom-btn"
                @click="deletePublisher(publisher._id)"
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
  props: ["publishers"],
  data() {
    return {
      itemsPerPage: 6, // Số NXB trên mỗi trang
      currentPage: 1, // Trang hiện tại
      searchQuery: "",
    };
  },
  computed: {
    filteredPublishers() {
      return this.publishers.filter((publisher) => {
        const query = this.searchQuery.toLowerCase();
        return (
          publisher.MANXB.toLowerCase().includes(query) ||
          publisher.TENNXB.toLowerCase().includes(query) ||
          publisher.DIACHI.toLowerCase().includes(query)
        );
      });
    },
    paginatedPublishers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPublishers.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredPublishers.length / this.itemsPerPage);
    },
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
    },
    editPublisher(id) {
      this.$emit("edit", id);
    },
    deletePublisher(id) {
      this.$emit("delete", id);
    },
  },
};
</script>

<style scoped>
@import "@/assets/styles.css";
</style>
