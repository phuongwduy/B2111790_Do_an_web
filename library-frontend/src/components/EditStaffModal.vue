<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
    aria-labelledby="editStaffLabel"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content shadow-lg rounded-3">
        <!-- Header -->
        <div class="modal-header bg-warning text-white">
          <h4 class="modal-title fw-bold">
            <i class="bi bi-pencil-square"></i> Chỉnh Sửa Nhân Viên
          </h4>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>

        <!-- Body -->
        <div class="modal-body px-4 py-4">
          <form @submit.prevent="updateStaff">
            <div class="row g-4">
              <!-- Mã Nhân Viên (Không chỉnh sửa) -->
              <div class="col-md-6">
                <label class="form-label fw-semibold"
                  ><i class="bi bi-person-badge"></i> Mã NV</label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.MSNV"
                  disabled
                />
              </div>

              <!-- Họ Tên -->
              <div class="col-md-6">
                <label class="form-label fw-semibold"
                  ><i class="bi bi-person"></i> Họ Tên</label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.HoTenNV"
                  required
                />
              </div>
            </div>

            <div class="row g-3 mt-2">
              <!-- Chức Vụ -->
              <div class="col-md-6">
                <label class="form-label fw-semibold"
                  ><i class="bi bi-briefcase"></i> Chức Vụ</label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.ChucVu"
                  required
                />
              </div>

              <!-- Địa chỉ -->
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  <i class="bi bi-geo-alt"></i> Địa chỉ
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.DiaChi"
                  required
                />
              </div>
            </div>

            <div class="row g-3 mt-2 mb-3">
              <!-- Số Điện Thoại -->
              <div class="col-md-6">
                <label class="form-label fw-semibold"
                  ><i class="bi bi-phone"></i> SĐT</label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.SoDienThoai"
                  required
                />
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
    staffId: String,
  },
  emits: ["close", "updated"],
  data() {
    return {
      formData: {
        MSNV: "",
        HoTenNV: "",
        ChucVu: "",
        DiaChi: "",
        SoDienThoai: "",
      },
    };
  },
  methods: {
    async fetchStaffData() {
      try {
        const response = await axios.get(`/api/staffs/${this.staffId}`);
        this.formData = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin NXB:", error);
      }
    },
    async updateStaff() {
      await axios.put(`/api/staffs/${this.staffId}`, this.formData);
      this.$emit("updated");
      this.$emit("close");
    },
  },
  mounted() {
    this.fetchStaffData();
  },
};
</script>
