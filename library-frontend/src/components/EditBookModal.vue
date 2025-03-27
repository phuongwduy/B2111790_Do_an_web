<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
    aria-labelledby="editBookLabel"
  >
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content shadow-lg rounded-3">
        <!-- Header -->
        <div class="modal-header bg-warning text-white">
          <h4 class="modal-title fw-bold" id="editBookLabel">
            <i class="bi bi-pencil-square"></i> Chỉnh Sửa Sách
          </h4>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>

        <!-- Body -->
        <div class="modal-body px-4 py-4">
          <form @submit.prevent="updateBook">
            <div class="row g-4">
              <!-- Mã Sách (Chỉ hiển thị, không chỉnh sửa) -->
              <div class="col-md-6">
                <label class="form-label fw-semibold"
                  ><i class="bi bi-book"></i> Mã Sách</label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.MASACH"
                  disabled
                />
              </div>

              <!-- Tên Sách -->
              <div class="col-md-6">
                <label class="form-label fw-semibold"
                  ><i class="bi bi-book-half"></i> Tên Sách</label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.TENSACH"
                  required
                />
              </div>
            </div>

            <div class="row g-3 mt-2">
              <!-- Tác Giả -->
              <div class="col-md-6">
                <label class="form-label fw-semibold"
                  ><i class="bi bi-pencil"></i> Tác Giả</label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.TACGIA"
                  required
                />
              </div>

              <!-- Số Quyển -->
              <div class="col-md-6">
                <label class="form-label fw-semibold"
                  ><i class="bi bi-123"></i> Số Quyển</label
                >
                <input
                  type="number"
                  class="form-control"
                  v-model.number="formData.SOQUYEN"
                  required
                />
              </div>
            </div>

            <div class="row g-3 mt-2">
              <!-- Đơn Giá -->
              <div class="col-md-6">
                <label class="form-label fw-semibold"
                  ><i class="bi bi-currency-dollar"></i> Đơn Giá</label
                >
                <input
                  type="number"
                  class="form-control"
                  v-model.number="formData.DONGIA"
                  required
                />
              </div>

              <!-- Năm Xuất Bản -->
              <div class="col-md-6">
                <label class="form-label fw-semibold"
                  ><i class="bi bi-calendar"></i> Năm Xuất Bản</label
                >
                <input
                  type="number"
                  class="form-control"
                  v-model.number="formData.NAMXUATBAN"
                  required
                />
              </div>
            </div>

            <div class="row g-3 mt-2 mb-3">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label fw-semibold"
                    ><i class="bi bi-building"></i> Nhà Xuất Bản</label
                  >
                  <select
                    class="form-select shadow-sm custom-select"
                    v-model="formData.MANXB"
                    required
                  >
                    <option value="" disabled selected hidden>
                      📚 Chọn Nhà Xuất Bản
                    </option>
                    <option
                      v-for="publisher in publishers"
                      :key="publisher.MANXB"
                      :value="publisher.MANXB"
                      class="custom-option"
                    >
                      {{ publisher.MANXB }} - {{ publisher.TENNXB }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-tags"></i> Thể Loại</label
                  >
                  <select
                    class="form-select shadow-sm custom-select"
                    v-model="formData.THELOAI"
                  >
                    <option value="" disabled selected hidden>
                      📚 Chọn Thể Loại
                    </option>
                    <option
                      v-for="category in categories"
                      :key="category"
                      :value="category"
                      class="custom-option"
                    >
                      {{ category }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-image"></i> Hình Ảnh</label
                  >
                  <input
                    type="file"
                    class="form-control"
                    @change="handleFileUpload"
                    accept="image/*"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <div v-if="previewImage" class="mt-2 text-center">
                    <img
                      :src="previewImage"
                      class="img-thumbnail"
                      style="max-width: 200px"
                      alt="Ảnh sách cũ"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- Footer -->
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="$emit('close')"
              >
                <i class="bi bi-x-circle"></i> Hủy
              </button>
              <button type="submit" class="btn btn-warning">
                <i class="bi bi-check-circle"></i> Cập Nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal backdrop -->
  <div class="modal-backdrop fade show"></div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    bookId: String, // Nhận ID sách từ component cha
  },
  emits: ["close", "updated"],
  data() {
    return {
      formData: {
        MASACH: "",
        TENSACH: "",
        TACGIA: "",
        SOQUYEN: 1,
        DONGIA: 0,
        NAMXUATBAN: "",
        MANXB: "",
        HINHANH: "",
        THELOAI: "",
      },
      previewImage: null,
      publishers: [],
      categories: [
        "Văn Học",
        "Khoa Học",
        "Lịch Sử",
        "Công Nghệ",
        "Giáo Dục",
        "Thiếu Nhi",
      ],
    };
  },
  methods: {
    async fetchBookData() {
      try {
        const response = await fetch(`/api/books/${this.bookId}`);
        const data = await response.json();
        if (!data) {
          throw new Error("No data received from API");
        }

        this.formData = data;
        if (this.formData.HINHANH) {
          this.previewImage = this.formData.HINHANH;
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sách:", error);
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.previewImage = URL.createObjectURL(file);
        this.convertToBase64(file);
      }
    },
    convertToBase64(file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.formData.HINHANH = reader.result;
      };
    },
    async fetchPublishers() {
      try {
        const response = await axios.get("/api/publishers");
        this.publishers = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhà xuất bản:", error);
      }
    },
    async updateBook() {
      try {
        await axios.put(`/api/books/${this.bookId}`, this.formData);
        alert("Cập nhật sách thành công!");
        this.$emit("updated"); // Thông báo cho cha làm mới danh sách
        this.$emit("close");
      } catch (error) {
        console.error("Lỗi khi cập nhật sách:", error);
        alert("Cập nhật thất bại!");
      }
    },
  },
  watch: {
    bookId(newId) {
      if (newId) {
        this.fetchBookData();
      }
    },
  },
  mounted() {
    this.fetchBookData();
    this.fetchPublishers();
  },
};
</script>

<style scoped>
.modal-content {
  border-radius: 12px;
  overflow: hidden;
}

.modal-header {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.form-label {
  font-weight: 600;
}

.input-group-text {
  background: #f8f9fa;
  border-right: none;
}

.btn {
  border-radius: 8px;
  transition: 0.3s;
}

.btn:hover {
  transform: scale(1.05);
}
.custom-btn {
  font-size: 1rem;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Hover: tạo hiệu ứng bóng */
.custom-btn:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

/* Nhấn xuống có hiệu ứng */
.custom-btn:active {
  transform: scale(0.98);
  box-shadow: none;
}

/* Icon to rõ hơn */
.custom-btn i {
  font-size: 1.2rem;
}
</style>
