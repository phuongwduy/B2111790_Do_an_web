<template>
  <div>
    <!-- Banner -->
    <div class="banner-container">
      <img :src="currentBanner" class="banner-img" alt="Thư viện sách" />
    </div>

    <div class="container mt-5">
      <div class="row">
        <!-- Sidebar -->

        <div class="col-md-3">
          <div class="alert alert-danger mt-5" role="alert">
            <h4 class="alert-heading">Thông báo</h4>
            <p>Mỗi độc giả chỉ có thể mượn tối đa 3 cuốn sách!</p>
          </div>
          <div class="card shadow-sm border-0">
            <div
              class="card-header text-white fw-bold text-center py-3 category-header"
            >
              Thể Loại Sách
            </div>
            <div class="list-group list-group-flush">
              <button
                v-for="category in categories"
                :key="category"
                @click="filterBooks(category)"
                class="list-group-item list-group-item-action text-center category-btn"
                :class="{ active: selectedCategory === category }"
              >
                {{ category }}
              </button>
            </div>
          </div>
        </div>

        <!-- Danh sách sách -->
        <div class="col-md-9">
          <h2 class="text-center fw-bold mb-4 main-title">Danh Sách Sách</h2>
          <div class="mb-4 d-flex justify-content-between align-items-center">
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Tìm kiếm sách..."
              @input="filterBooksBySearch"
            />
          </div>
          <div
            v-if="books.length"
            class="row row-cols-1 row-cols-sm-2 row-cols-md-3"
          >
            <div
              class="col mb-4"
              v-for="book in paginatedBooks"
              :key="book._id"
            >
              <div class="card h-100 shadow-sm border-0">
                <!-- Hiển thị hình ảnh sách -->
                <img
                  v-if="book.HINHANH"
                  :src="book.HINHANH"
                  class="card-img-top book-image mt-3"
                  alt="Hình ảnh sách"
                />

                <div class="card-body">
                  <h5 class="card-title fw-bold book-title">
                    {{ book.TENSACH }}
                  </h5>
                  <p class="card-text mb-1">
                    <strong>Tác giả:</strong> {{ book.TACGIA }}
                  </p>
                  <p class="card-text">
                    <strong>Số lượng:</strong> {{ book.SOQUYEN }}
                  </p>
                </div>
                <div class="card-footer bg-transparent border-0 text-center">
                  <button
                    @click="borrowBook(book)"
                    class="btn borrow-btn w-100 fw-bold"
                    :disabled="book.SOQUYEN === 0"
                  >
                    {{ book.SOQUYEN > 0 ? "Mượn Sách" : "Hết Sách" }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center mt-5">
            <p class="text-danger fw-bold fs-5">
              Hiện không có sách nào để mượn.
            </p>
          </div>

          <!-- Phân trang -->
          <div
            v-if="totalPages > 1"
            class="pagination-container text-center mt-4"
          >
            <button
              class="btn pagination-btn"
              @click="currentPage--"
              :disabled="currentPage === 1"
            >
              Trang trước
            </button>

            <span class="fw-bold mx-3"
              >Trang {{ currentPage }} / {{ totalPages }}</span
            >

            <button
              class="btn pagination-btn"
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

export default {
  setup() {
    const books = ref([]);
    const selectedCategory = ref("Tất cả");
    const searchQuery = ref("");

    const categories = ref([
      "Tất cả",
      "Văn Học",
      "Khoa Học",
      "Lịch Sử",
      "Công Nghệ",
      "Giáo Dục",
      "Thiếu Nhi",
    ]);

    const currentBanner = ref("/images/banner.jpg");

    const currentPage = ref(1);
    const booksPerPage = ref(6);

    const fetchBooks = async () => {
      try {
        console.log("Đang lấy danh sách sách...");
        const response = await axios.get("/api/books", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        books.value = response.data.books || response.data;
        console.log("Danh sách sách:", books.value);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
        alert("Không thể tải danh sách sách. Vui lòng thử lại!");
      }
    };

    const borrowBook = async (book) => {
      const maSach = book.MASACH || book._id;
      console.log(`Mượn sách với MASACH: ${maSach}`);

      try {
        const response = await axios.post(
          "/api/borrows",
          { MASACH: maSach },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        console.log("Phản hồi từ server:", response.data);
        alert(response.data.message);
      } catch (error) {
        console.error("Lỗi khi mượn sách:", error.response?.data || error);
        alert(error.response?.data?.message || "Không thể mượn sách");
      }
    };

    const filterBooks = (category) => {
      selectedCategory.value = category;
      currentPage.value = 1;
    };

    const filterBooksBySearch = () => {
      currentPage.value = 1;
    };

    const filteredBooks = computed(() => {
      let result = books.value;

      if (selectedCategory.value !== "Tất cả") {
        result = result.filter(
          (book) => book.THELOAI === selectedCategory.value
        );
      }

      if (searchQuery.value) {
        result = result.filter(
          (book) =>
            book.TENSACH.toLowerCase().includes(
              searchQuery.value.toLowerCase()
            ) ||
            book.TACGIA.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      return result;
    });

    const paginatedBooks = computed(() => {
      const start = (currentPage.value - 1) * booksPerPage.value;
      const end = start + booksPerPage.value;
      return filteredBooks.value.slice(start, end);
    });

    const totalPages = computed(() =>
      Math.ceil(filteredBooks.value.length / booksPerPage.value)
    );

    onMounted(() => {
      fetchBooks();
    });

    return {
      books,
      borrowBook,
      categories,
      selectedCategory,
      filterBooks,
      filteredBooks,
      paginatedBooks,
      searchQuery,
      currentBanner,
      currentPage,
      booksPerPage,
      totalPages,
      filterBooksBySearch,
    };
  },
};
</script>

<style scoped>
/* Banner */
.banner-container {
  width: 100%;
  height: 300px;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e8f5e9;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Sidebar */
.category-header {
  background-color: #388e3c;
}

.category-btn {
  color: #333;
  transition: 0.3s;
}

.category-btn.active,
.category-btn:hover {
  background-color: #81c784;
  color: white;
}

/* Danh sách sách */
.main-title {
  color: #388e3c;
}

.book-title {
  color: #2e7d32;
}

/* Nút mượn sách */
.borrow-btn {
  background-color: #388e3c;
  color: white;
}

.borrow-btn:hover {
  background-color: #66bb6a;
}

.borrow-btn:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}

/* Phân trang */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.pagination-btn {
  background-color: #388e3c;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: bold;
}

.pagination-btn:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}
</style>
