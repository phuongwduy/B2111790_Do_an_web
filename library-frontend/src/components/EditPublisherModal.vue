<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
    aria-labelledby="editPublisherLabel"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content shadow-lg rounded-3">
        <!-- Header -->
        <div class="modal-header bg-warning text-white">
          <h4 class="modal-title fw-bold" id="editPublisherLabel">
            <i class="bi bi-building"></i> Chỉnh Sửa Nhà Xuất Bản
          </h4>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>

        <!-- Body -->
        <div class="modal-body px-4 py-4">
          <form @submit.prevent="updatePublisher">
            <!-- Mã Nhà Xuất Bản (Chỉ hiển thị, không chỉnh sửa) -->
            <div class="mb-3">
              <label class="form-label fw-semibold">
                <i class="bi bi-tag"></i> Mã Nhà Xuất Bản
              </label>
              <input
                type="text"
                class="form-control"
                v-model="formData.MANXB"
                disabled
              />
            </div>

            <!-- Tên Nhà Xuất Bản -->
            <div class="mb-3">
              <label class="form-label fw-semibold">
                <i class="bi bi-bookmark"></i> Tên Nhà Xuất Bản
              </label>
              <input
                type="text"
                class="form-control"
                v-model="formData.TENNXB"
                required
              />
            </div>

            <!-- Địa Chỉ -->
            <div class="mb-3">
              <label class="form-label fw-semibold">
                <i class="bi bi-geo-alt"></i> Địa Chỉ
              </label>
              <input
                type="text"
                class="form-control"
                v-model="formData.DIACHI"
                required
              />
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
    publisherId: String, // Nhận ID từ cha
  },
  data() {
    return {
      formData: {
        MANXB: "", // Mã Nhà Xuất Bản (Chỉ đọc)
        TENNXB: "",
        DIACHI: "",
      },
    };
  },
  methods: {
    async fetchPublisherData() {
      if (!this.publisherId) return;
      try {
        const response = await axios.get(`/api/publishers/${this.publisherId}`);
        this.formData = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin NXB:", error);
      }
    },
    async updatePublisher() {
      try {
        await axios.put(`/api/publishers/${this.publisherId}`, {
          TENNXB: this.formData.TENNXB,
          DIACHI: this.formData.DIACHI,
        });
        alert(" Cập nhật thành công!");
        this.$emit("updated");
        this.$emit("close");
      } catch (error) {
        console.error("Lỗi khi cập nhật NXB:", error);
        alert("Cập nhật thất bại!");
      }
    },
  },
  watch: {
    publisherId(newId) {
      if (newId) {
        this.fetchPublisherData();
      }
    },
  },
  mounted() {
    this.fetchPublisherData();
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

input:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.btn {
  border-radius: 8px;
  transition: 0.3s;
}

.btn:hover {
  transform: scale(1.05);
}
</style>
