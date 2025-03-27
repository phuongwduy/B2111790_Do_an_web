<template>
  <div class="app-container">
    <NavBar v-if="isUserPage" />

    <div class="container-fluid main-content">
      <div class="row">
        <div v-if="isAdminPage" class="col-md-2 col-lg-2 px-0">
          <NavSidebar />
        </div>

        <!-- Nội dung chính -->
        <div :class="mainContentClass">
          <router-view />
        </div>
      </div>
    </div>
    <FooterComponent v-if="isBorrowOrHistoryPage" />
  </div>
</template>

<script>
import NavSidebar from "./components/NavBarSide.vue";
import NavBar from "./components/NavBar.vue";
import FooterComponent from "./components/Footer.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

export default {
  components: {
    NavSidebar,
    NavBar,
    FooterComponent,
  },
  setup() {
    const route = useRoute();

    // (Không có Navbar, Sidebar, Footer)
    const isAuthPage = computed(() =>
      ["/login", "/register"].includes(route.path)
    );

    // Có Navbar + Footer
    const isUserPage = computed(
      () =>
        ["/borrowbooks", "/history", "/profile"].some((path) =>
          route.path.startsWith(path)
        ) || route.path.startsWith("/books/")
    );

    // (Có Sidebar bên trái, Không có Footer)
    const isAdminPage = computed(() =>
      ["/books", "/publishers", "/readers", "/borrower", "/staffs"].includes(
        route.path
      )
    );

    // Xác định trang có Footer
    const isBorrowOrHistoryPage = computed(
      () =>
        ["/borrowbooks", "/history", "/profile"].some((path) =>
          route.path.startsWith(path)
        ) || route.path.startsWith("/books/")
    );

    const mainContentClass = computed(() => {
      if (isAuthPage.value) return "col-12 auth-container";
      return isAdminPage.value
        ? "col-md-10 col-lg-10 content"
        : "col-12 content";
    });

    return {
      isAuthPage,
      isUserPage,
      isAdminPage,
      isBorrowOrHistoryPage,
      mainContentClass,
    };
  },
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-x: auto;
}

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
}
</style>
