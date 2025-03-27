<template>
  <div class="container-fluid">
    <StaffTable
      :staffList="staffList"
      @add="showAddModal = true"
      @edit="openEditModal"
      @delete="deleteStaff"
    />

    <AddStaffModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @added="fetchStaff"
    />

    <EditStaffModal
      v-if="showEditModal"
      :staffId="selectedStaffId"
      @close="showEditModal = false"
      @updated="fetchStaff"
    />
  </div>
</template>

<script>
import axios from "axios";
import StaffTable from "@/components/StaffTable.vue";
import AddStaffModal from "@/components/AddStaffModal.vue";
import EditStaffModal from "@/components/EditStaffModal.vue";

export default {
  components: { StaffTable, EditStaffModal, AddStaffModal },
  data() {
    return {
      staffList: [],
      showAddModal: false,
      showEditModal: false,
      selectedStaffId: null,
    };
  },
  methods: {
    async fetchStaff() {
      try {
        const response = await axios.get("/api/staffs", {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        });
        this.staffList = response.data.staffs || response.data;
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhân viên:", error);
      }
    },
    openEditModal(staffId) {
      this.selectedStaffId = staffId;
      this.showEditModal = true;
    },
    async deleteStaff(id) {
      if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
        try {
          await axios.delete(`/api/staffs/${id}`);
          this.fetchStaff();
        } catch (error) {
          console.error("Lỗi khi xóa nhân viên:", error);
        }
      }
    },
  },
  mounted() {
    this.fetchStaff();
  },
};
</script>

<style scoped>
.custom-btn {
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: 10px 18px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-btn:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.custom-btn:active {
  transform: scale(0.98);
  box-shadow: none;
}

.custom-btn i {
  font-size: 1.2rem;
}
</style>
