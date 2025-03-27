<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
    aria-labelledby="addBookLabel"
  >
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content shadow-lg rounded-3">
        <div class="modal-header bg-primary text-white">
          <h4 class="modal-title fw-bold" id="addBookLabel">
            <i class="bi bi-book"></i> Thêm Sách Mới
          </h4>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>
        <div class="modal-body px-4 py-4">
          <form @submit.prevent="handleSubmit">
            <div class="row g-4">
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  <i class="bi bi-book-half"></i> Tên Sách</label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="book.TENSACH"
                  placeholder="Nhập tên sách"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  <i class="bi bi-pencil-square"></i> Tác Giả</label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="book.TACGIA"
                  placeholder="Nhập tên tác giả"
                  required
                />
              </div>
            </div>

            <div class="row g-3 mt-2">
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  <i class="bi bi-123"></i> Số Quyển</label
                >
                <input
                  type="number"
                  class="form-control"
                  v-model.number="book.SOQUYEN"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  <i class="bi bi-currency-dollar"></i> Đơn Giá</label
                >
                <input
                  type="number"
                  class="form-control"
                  v-model.number="book.DONGIA"
                  placeholder="Nhập đơn giá"
                  required
                />
              </div>
            </div>

            <div class="row g-3 mt-2">
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  <i class="bi bi-calendar"></i> Năm Xuất Bản</label
                >
                <input
                  type="number"
                  class="form-control"
                  v-model.number="book.NAMXUATBAN"
                  placeholder="Nhập năm xuất bản"
                  required
                />
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label fw-semibold"
                    ><i class="bi bi-building"></i> Nhà Xuất Bản</label
                  >
                  <select
                    class="form-select shadow-sm custom-select"
                    v-model="book.MANXB"
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
            </div>

            <!-- Dropdown cho thể loại sách -->
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-tags"></i> Thể Loại</label
                  >
                  <select
                    class="form-select shadow-sm custom-select"
                    v-model="book.THELOAI"
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
            </div>

            <!-- Trường thêm ảnh -->
            <div class="row g-3 mt-3">
              <div class="col-md-12 mb-3">
                <div v-if="previewImage" class="mt-2 text-center">
                  <img
                    :src="previewImage"
                    class="img-thumbnail"
                    style="max-width: 200px"
                    alt="Xem trước ảnh sách"
                  />
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary custom-btn"
                @click="$emit('close')"
              >
                <i class="bi bi-x-circle me-2"></i> Hủy
              </button>
              <button type="submit" class="btn btn-primary custom-btn">
                <i class="bi bi-check-circle me-2"></i> Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div class="modal-backdrop fade show" v-if="visible"></div>
</template>

<script>
import axios from "axios";

export default {
  emits: ["close", "added", "submitted"],
  data() {
    return {
      visible: true,
      book: {
        TENSACH: "",
        DONGIA: 0,
        SOQUYEN: 1,
        NAMXUATBAN: 0,
        MANXB: "",
        TACGIA: "",
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
    async fetchPublishers() {
      try {
        const response = await axios.get("/api/publishers");
        this.publishers = response.data || [];
      } catch (error) {
        console.error("Lỗi khi lấy danh sách NXB:", error);
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
        this.book.HINHANH = reader.result;
      };
    },
    handleSubmit() {
      const bookData = { ...this.book };

      if (!this.previewImage) {
        delete bookData.HINHANH;
      }

      this.$emit("submitted", bookData);
      this.close();
    },
    close() {
      this.visible = false;
      this.$emit("close");
    },
  },
  mounted() {
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

.img-thumbnail {
  border-radius: 10px;
  margin-top: 5px;
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

.custom-btn:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.custom-btn:active {
  transform: scale(0.98);
  box-shadow: none;
}

.custom-dropdown {
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 14px;
  height: 45px;
  border: 1.5px solid #ced4da;
  background-color: #fff;
  transition: all 0.3s ease;
}

.custom-dropdown:focus {
  border-color: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
  outline: none;
}

.custom-dropdown option {
  padding: 10px;
  font-size: 14px;
}

.custom-dropdown:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}
</style>
