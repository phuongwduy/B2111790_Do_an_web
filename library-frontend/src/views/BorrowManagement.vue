<template>
  <div class="container-fluid">
    <BorrowTable
      :borrows="borrows"
      @confirm-borrow="confirmBorrow"
      @return-book="returnBook"
      @delete-borrow="handleDelete"
    />
  </div>
</template>

<script>
import axios from "axios";
import BorrowTable from "@/components/BorrowTable.vue";

export default {
  components: { BorrowTable },
  data() {
    return {
      borrows: [],
    };
  },
  methods: {
    async fetchBorrows() {
      try {
        const res = await axios.get("/api/borrows", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        this.borrows = res.data;
      } catch (error) {
        console.error("Lỗi lấy danh sách mượn sách:", error);
      }
    },
    async confirmBorrow(id) {
      try {
        await axios.put(
          `/api/borrows/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        this.borrows = this.borrows.map((b) =>
          b._id === id ? { ...b, TRANGTHAI: "DANGMUON" } : b
        );
        alert("Xác nhận thành công!");
      } catch (error) {
        console.error("Lỗi xác nhận:", error);
      }
    },
    async returnBook(id) {
      try {
        await axios.put(
          `/api/borrows/return/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        this.borrows = this.borrows.map((b) =>
          b._id === id ? { ...b, TRANGTHAI: "DATRA" } : b
        );
        alert("Trả sách thành công!");
      } catch (error) {
        console.error("Lỗi trả sách:", error);
      }
    },
    async handleDelete(id) {
      if (!confirm("Bạn có chắc chắn muốn xóa không?")) return;
      try {
        await axios.delete(`/api/borrows/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

        this.borrows = this.borrows.filter((b) => b._id !== id);
        alert("Xóa thành công!");
      } catch (error) {
        console.error("Lỗi xóa:", error);
        if (error.response && error.response.status === 400) {
          alert("Không thể xóa, sách đang được mượn!");
        } else {
          alert("Có lỗi xảy ra khi xóa. Vui lòng thử lại!");
        }
      }
    },
  },
  mounted() {
    this.fetchBorrows();
  },
};
</script>
