<template>
  <div class="container-fluid mt-2">
    <!-- Thanh tìm kiếm -->
    <div class="alert alert-danger" role="alert">
      <h4 class="alert-heading">Thông báo</h4>
      <p>
        Sau khi gửi yêu cầu xác nhận hãy đến thư viện nhận sách. Sau 48h không
        nhận sẽ hủy yêu cầu!!
      </p>
    </div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="text-green fw-bold mb-0">Lịch Sử Mượn Sách</h3>
      <div class="input-group w-50">
        <input
          type="text"
          class="form-control"
          placeholder="Tìm kiếm ..."
          v-model="searchQuery"
        />
        <span class="input-group-text"><i class="bi bi-search"></i></span>
      </div>
    </div>

    <!-- Hiển thị từng danh sách -->
    <div v-for="(list, key) in paginatedHistory" :key="key" class="mb-4">
      <h4
        class="fw-bold text-uppercase text-center"
        :class="statusTitleClass(key)"
      >
        {{ getStatusTitle(key) }}
      </h4>

      <div v-if="list.items.length" class="table-responsive">
        <table class="table table-striped table-bordered shadow-sm">
          <thead class="table-green">
            <tr class="text-center">
              <th>STT</th>
              <th>Tên Sách</th>
              <th>Ngày Mượn</th>
              <th>Hạn Trả</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(borrow, index) in list.items"
              :key="borrow._id"
              class="text-center"
            >
              <td>{{ index + 1 + (list.currentPage - 1) * itemsPerPage }}</td>
              <td>{{ borrow.TENSACH }}</td>
              <td>{{ formatDate(borrow.NGAYMUON) }}</td>
              <td>
                {{ borrow.NGAYTRA ? formatDate(borrow.NGAYTRA) : "Chưa trả" }}
              </td>
              <td>
                <span :class="statusClass(borrow.TRANGTHAI)">
                  {{ getStatusText(borrow.TRANGTHAI) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Phân trang -->
        <nav class="mt-3">
          <ul class="pagination justify-content-center">
            <li
              v-for="page in list.totalPages"
              :key="page"
              class="page-item"
              :class="{ active: page === list.currentPage }"
            >
              <button class="page-link" @click="changePage(key, page)">
                {{ page }}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div v-else class="text-center text-muted">
        <p>Không có sách trong danh mục này.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    borrowHistory: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: "",
      itemsPerPage: 3,
      currentPage: {
        CHOXACNHAN: 1,
        DANGMUON: 1,
        DATRA: 1,
      },
    };
  },
  computed: {
    filteredHistory() {
      if (!this.searchQuery) return this.borrowHistory;
      const query = this.searchQuery.toLowerCase();
      return this.borrowHistory.filter((borrow) =>
        borrow.TENSACH.toLowerCase().includes(query)
      );
    },
    categorizedHistory() {
      return {
        CHOXACNHAN: this.filteredHistory.filter(
          (b) => b.TRANGTHAI === "CHOXACNHAN"
        ),
        DANGMUON: this.filteredHistory.filter(
          (b) => b.TRANGTHAI === "DANGMUON"
        ),
        DATRA: this.filteredHistory.filter((b) => b.TRANGTHAI === "DATRA"),
      };
    },
    paginatedHistory() {
      const paginatedData = {};
      for (const key in this.categorizedHistory) {
        const start = (this.currentPage[key] - 1) * this.itemsPerPage;
        const items = this.categorizedHistory[key].slice(
          start,
          start + this.itemsPerPage
        );
        paginatedData[key] = {
          items,
          currentPage: this.currentPage[key],
          totalPages: Math.ceil(
            this.categorizedHistory[key].length / this.itemsPerPage
          ),
        };
      }
      return paginatedData;
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN");
    },
    getStatusText(status) {
      return {
        CHOXACNHAN: "Chờ Xác Nhận",
        DANGMUON: "Đang Mượn",
        DATRA: "Đã Trả",
      }[status];
    },
    statusClass(status) {
      return {
        CHOXACNHAN: "text-warning",
        DANGMUON: "text-green-dark",
        DATRA: "text-blue",
      }[status];
    },
    getStatusTitle(status) {
      return {
        CHOXACNHAN: "Chờ Xác Nhận",
        DANGMUON: "Đang Mượn",
        DATRA: "Đã Trả",
      }[status];
    },
    statusTitleClass(status) {
      return {
        CHOXACNHAN: "text-warning",
        DANGMUON: "text-green-dark",
        DATRA: "text-blue",
      }[status];
    },
    changePage(category, page) {
      this.currentPage[category] = page;
    },
  },
};
</script>

<style scoped>
/* Màu chủ đạo */
.text-green {
  color: #388e3c;
}
.table-green {
  background-color: #388e3c;
  color: white;
}

/* Màu trạng thái */
.text-warning {
  color: #ffc107;
}
.text-green-dark {
  color: #388e3c; /* Xanh lá đậm */
}
.text-blue {
  color: #1e88e5; /* Xanh lam dịu */
}

/* Phân trang */
.pagination .page-link {
  border-radius: 50%;
  padding: 8px 12px;
  margin: 0 5px;
  font-weight: bold;
  transition: 0.2s;
  border: 1px solid #81c784;
  color: #81c784;
}
.pagination .page-item.active .page-link,
.pagination .page-link:hover {
  background-color: #66bb6a;
  color: white;
  border: 1px solid #66bb6a;
}
</style>
