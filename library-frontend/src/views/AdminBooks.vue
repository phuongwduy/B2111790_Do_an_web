<template>
  <div class="container-fluid">
    <BookTable
      :books="books"
      @add="showAddModal = true"
      @edit="openEditModal"
      @delete="deleteBook"
    />

    <!-- Modal thêm sách -->
    <AddBookModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @submitted="submitBook"
    />

    <!-- Modal chỉnh sửa sách -->
    <EditBookModal
      v-if="showEditModal"
      :bookId="selectedBookId"
      @close="showEditModal = false"
      @updated="fetchBooks"
    />
  </div>
</template>

<script>
import axios from "axios";
import BookTable from "@/components/BookTable.vue";
import AddBookModal from "@/components/AddBookModal.vue";
import EditBookModal from "@/components/EditBookModal.vue";

export default {
  components: { BookTable, AddBookModal, EditBookModal },
  data() {
    return {
      books: [],
      showAddModal: false,
      showEditModal: false,
      selectedBookId: null,
    };
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await axios.get("/api/books", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        this.books = response.data.books || response.data;
      } catch (error) {
        console.error("Lỗi khi lấy sách:", error);
      }
    },
    async submitBook(bookData) {
      try {
        if (!bookData.HINHANH) {
          delete bookData.HINHANH;
        }

        await axios.post("/api/books", bookData);
        this.fetchBooks();
        this.showAddModal = false;
      } catch (error) {
        console.error("Lỗi khi thêm sách:", error);
        if (error.response) {
          console.error("Phản hồi từ server:", error.response.data);
        }
      }
    },
    openEditModal(bookId) {
      this.selectedBookId = bookId;
      this.showEditModal = true;
    },
    async deleteBook(id) {
      if (!confirm("Bạn có chắc chắn muốn xóa sách này không?")) return;

      try {
        await axios.delete(`/api/books/${id}`);
        this.fetchBooks();
        alert("Xóa sách thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa sách:", error);
        if (error.response && error.response.status === 400) {
          alert("Không thể xóa sách vì đang có người mượn!");
        } else {
          alert("Có lỗi xảy ra khi xóa. Vui lòng thử lại!");
        }
      }
    },
  },
  mounted() {
    this.fetchBooks();
  },
};
</script>

<style scoped>
.custom-btn {
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: 10px 18px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-btn:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.custom-btn:active {
  transform: scale(0.98);
  box-shadow: none;
}

.custom-btn i {
  font-size: 1.2rem;
}
</style>
