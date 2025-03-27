<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
    aria-labelledby="addPublisherLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content shadow-lg rounded-3">
        <div class="modal-header bg-primary text-white">
          <h4 class="modal-title fw-bold" id="addPublisherLabel">
            <i class="bi bi-building"></i> Thêm Nhà Xuất Bản
          </h4>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>
        <div class="modal-body px-4 py-4">
          <form @submit.prevent="addPublisher">
            <div class="row g-4">
              <div class="col-md-12">
                <label class="form-label fw-semibold">
                  <i class="bi bi-type me-2"></i> Tên NXB
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="publisher.TENNXB"
                  placeholder="Nhập tên NXB"
                  required
                />
              </div>
            </div>

            <div class="row g-4 mt-2 mb-4">
              <div class="col-md-12">
                <label class="form-label fw-semibold">
                  <i class="bi bi-geo-alt me-2"></i> Địa Chỉ
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="publisher.DIACHI"
                  placeholder="Nhập địa chỉ NXB"
                  required
                />
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary custom-btn-lg"
                @click="$emit('close')"
              >
                <i class="bi bi-x-circle me-2"></i> Hủy
              </button>
              <button type="submit" class="btn btn-primary custom-btn-lg">
                <i class="bi bi-check-circle me-2"></i> Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div class="modal-backdrop fade show"></div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      publisher: {
        TENNXB: "",
        DIACHI: "",
      },
    };
  },
  methods: {
    async addPublisher() {
      try {
        await axios.post("/api/publishers", this.publisher);
        this.$emit("added");
        this.$emit("close");
      } catch (error) {
        console.error("Lỗi khi thêm NXB:", error);
      }
    },
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

.custom-btn:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}
.custom-btn:active {
  transform: scale(0.98);
  box-shadow: none;
}

.custom-btn i {
  font-size: 1.2rem;
}
</style>
