<template>
  <div class="container-fluid">
    <!-- Bảng hiển thị danh sách NXB -->
    <PublisherTable
      :publishers="publishers"
      @add="showAddModal = true"
      @edit="openEditModal"
      @delete="deletePublisher"
    />

    <!-- Modal thêm NXB -->
    <AddPublisherModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @added="fetchPublishers"
    />

    <!-- Modal chỉnh sửa NXB -->
    <EditPublisherModal
      v-if="showEditModal"
      :publisherId="selectedPublisherId"
      @close="showEditModal = false"
      @updated="fetchPublishers"
    />
  </div>
</template>

<script>
import axios from "axios";
import PublisherTable from "@/components/PubTable.vue";
import AddPublisherModal from "@/components/AddPublisherModal.vue";
import EditPublisherModal from "@/components/EditPublisherModal.vue";

export default {
  components: { PublisherTable, AddPublisherModal, EditPublisherModal },
  data() {
    return {
      publishers: [],
      showAddModal: false,
      showEditModal: false,
      selectedPublisherId: null,
    };
  },
  methods: {
    async fetchPublishers() {
      try {
        const response = await axios.get("/api/publishers");
        this.publishers = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách NXB:", error);
      }
    },
    openEditModal(publisherId) {
      this.selectedPublisherId = publisherId;
      this.showEditModal = true;
    },
    async deletePublisher(id) {
      if (confirm("Bạn có chắc chắn muốn xóa nhà xuất bản này?")) {
        try {
          await axios.delete(`/api/publishers/${id}`);
          alert("Xóa thành công!");
          this.fetchPublishers();
        } catch (error) {
          console.error("Lỗi khi xóa NXB:", error);
          if (error.response && error.response.status === 400) {
            alert("Không thể xóa! Nhà xuất bản này có sách liên quan.");
          } else {
            alert("Lỗi khi xóa!");
          }
        }
      }
    },
  },
  mounted() {
    this.fetchPublishers();
  },
};
</script>
