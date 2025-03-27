<template>
  <div class="container mt-3">
    <div class="card shadow-lg p-4">
      <div class="card-header bg-success text-white text-center">
        <h2>Thông tin Độc Giả</h2>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>

        <div v-else-if="reader">
          <div class="row">
            <!-- Cột Avatar -->
            <div class="col-md-4 text-center">
              <div class="mb-2">
                <button
                  class="btn btn-outline-secondary"
                  @click="showAvatarModal = true"
                >
                  Chọn Avatar
                </button>
              </div>
              <img
                :src="reader.avatar || defaultAvatar"
                alt="Avatar"
                class="avatar-img mb-2"
              />

              <div class="ms-3">
                <h4 class="fw-bold">{{ reader.HoLot }} {{ reader.Ten }}</h4>
              </div>
            </div>

            <!-- Cột Form -->
            <div class="col-md-8">
              <form @submit.prevent="updateReader">
                <div class="mb-3">
                  <label class="form-label">Họ và tên:</label>
                  <div class="row">
                    <div class="col-md-6">
                      <input
                        type="text"
                        class="form-control"
                        v-model="reader.HoLot"
                      />
                    </div>
                    <div class="col-md-6">
                      <input
                        type="text"
                        class="form-control"
                        v-model="reader.Ten"
                      />
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Ngày sinh:</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="reader.NgaySinh"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Địa chỉ:</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="reader.DiaChi"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Số điện thoại:</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="reader.DienThoai"
                  />
                </div>

                <button type="submit" class="btn btn-success w-100 save-btn">
                  💾 Lưu Thay Đổi
                </button>
              </form>
            </div>
          </div>
        </div>

        <div v-else class="alert alert-danger text-center">
          Không thể tải thông tin độc giả.
        </div>
      </div>
    </div>

    <!-- Modal chọn avatar -->
    <div v-if="showAvatarModal" class="modal-backdrop">
      <div class="modal-content">
        <h4 class="text-center">Chọn ảnh đại diện</h4>
        <div class="avatar-grid">
          <img
            v-for="(avatar, index) in availableAvatars"
            :key="index"
            :src="avatar"
            class="avatar-option"
            :class="{ selected: avatar === selectedAvatar }"
            @click="selectedAvatar = avatar"
          />
        </div>
        <button
          class="btn btn-primary w-100 mt-3"
          :disabled="!selectedAvatar"
          @click="confirmAvatarSelection"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import defaultAvatar from "@/assets/avatar.png";

export default {
  data() {
    return {
      reader: null,
      loading: true,
      showAvatarModal: false,
      selectedAvatar: null, // Lưu ảnh đã chọn tạm thời
      defaultAvatar, // Ảnh mặc định
      availableAvatars: [
        "/avatars/avatar1.png",
        "/avatars/avatar2.png",
        "/avatars/avatar3.png",
        "/avatars/avatar4.png",
        "/avatars/avatar5.png",
      ],
    };
  },
  methods: {
    async fetchReaderInfo() {
      try {
        const response = await axios.get("/api/readers/profile", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        this.reader = response.data;
        if (this.reader.NgaySinh) {
          this.reader.NgaySinh = this.reader.NgaySinh.split("T")[0];
        }
      } catch (error) {
        console.error(
          "Lỗi khi lấy thông tin độc giả:",
          error.response?.data || error
        );
      } finally {
        this.loading = false;
      }
    },

    async updateReader() {
      try {
        await axios.put("/api/readers/profile", this.reader, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        alert("Cập nhật thông tin thành công!");
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error.response?.data || error);
        alert("Cập nhật thất bại!");
      }
    },

    async confirmAvatarSelection() {
      if (!this.selectedAvatar) return;

      try {
        const response = await axios.put(
          "/api/readers/update-avatar",
          { avatarUrl: this.selectedAvatar },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        this.reader.avatar = response.data.avatarUrl;
        this.$forceUpdate();
        alert("Cập nhật avatar thành công!");
      } catch (error) {
        console.error("Lỗi cập nhật avatar:", error.response?.data || error);
        alert(error.response?.data?.message || "Cập nhật avatar thất bại!");
      }

      this.showAvatarModal = false; // Đóng modal sau khi chọn
    },
  },

  mounted() {
    this.fetchReaderInfo();
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
.avatar-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ddd;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: #66bb6a;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 350px;
}

.avatar-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.avatar-option {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
}

.avatar-option.selected {
  border: 3px solid#66bb6a;
}

.btn {
  width: auto;
  padding: 10px 30px;
}
</style>
