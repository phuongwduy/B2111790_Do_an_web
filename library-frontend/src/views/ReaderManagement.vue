<template>
  <div class="container-fluid">
    <!-- Bảng hiển thị danh sách độc giả -->
    <ReaderTable :readers="readers" @delete="deleteReader" />
  </div>
</template>

<script>
import axios from "axios";
import ReaderTable from "@/components/ReaderTable.vue";

export default {
  components: { ReaderTable },
  data() {
    return {
      readers: [],
    };
  },
  methods: {
    async fetchReaders() {
      try {
        const response = await axios.get("/api/readers", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        this.readers = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách độc giả:", error);
      }
    },
    async deleteReader(id) {
      if (!confirm("Bạn có chắc chắn muốn xóa sách này không?")) return;

      try {
        await axios.delete(`/api/readers/${id}`);
        this.fetchReaders();
        alert("Xóa sách thành công!");
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert("Không thể xóa sách vì đang có người mượn!");
        } else {
          alert("Có lỗi xảy ra khi xóa. Vui lòng thử lại!");
        }
      }
    },
  },
  mounted() {
    this.fetchReaders();
  },
};
</script>
