<template>
  <div>
    <div class="container mt-5">
      <BorrowHistoryTable :borrowHistory="borrowHistory" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import BorrowHistoryTable from "@/components/BorrowHistoryTable.vue";

export default {
  components: {
    BorrowHistoryTable,
  },
  setup() {
    const borrowHistory = ref([]);

    const fetchBorrowHistory = async () => {
      try {
        const response = await axios.get("/api/borrows/history", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        borrowHistory.value = response.data.history;
      } catch (error) {
        console.error("Lỗi khi tải lịch sử mượn sách:", error);
      }
    };

    onMounted(fetchBorrowHistory);

    return {
      borrowHistory,
    };
  },
};
</script>
