import { createWebHistory, createRouter } from "vue-router";
import axios from "axios";

import LoginPage from "@/views/LoginPage.vue";
import AdminBooks from "@/views/AdminBooks.vue";
import BorrowBooks from "@/views/BorrowBooks.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import PublishersManagement from "@/views/PublishersManagement.vue";
import ReaderManagement from "@/views/ReaderManagement.vue";
import BorrowManagement from "@/views/BorrowManagement.vue";
import StaffManagement from "@/views/StaffManagement.vue";
import History from "@/views/History.vue";
import Profile from "@/views/Profile.vue";
const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginPage },
  {
    path: "/books",
    component: AdminBooks,
    meta: { requiresAuth: true, role: "NhanVien" },
  },
  {
    path: "/register",
    component: RegisterPage,
  },
  {
    path: "/publishers",
    component: PublishersManagement,
  },
  {
    path: "/readers",
    component: ReaderManagement,
  },
  {
    path: "/borrower",
    component: BorrowManagement,
  },
  {
    path: "/staffs",
    component: StaffManagement,
  },
  {
    path: "/borrowbooks",
    component: BorrowBooks,
    meta: { requiresAuth: true, role: "DocGia" },
  },
  {
    path: "/history",
    component: History,
  },
  {
    path: "/profile",
    component: Profile,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authToken = sessionStorage.getItem("token");

  // Nếu không có token, chỉ cho phép vào /login hoặc /register
  if (!authToken) {
    if (to.path === "/login" || to.path === "/register") {
      return next();
    }
    return next("/login");
  }

  try {
    const payload = JSON.parse(atob(authToken.split(".")[1])); // Decode JWT
    const role = payload.role;
    if (to.path === "/login") {
      return next(role === "NhanVien" ? "/books" : "/borrowbooks");
    }

    // Kiểm tra quyền truy cập
    const adminRoutes = [
      "/books",
      "/publishers",
      "/readers",
      "/borrower",
      "/staffs",
    ];
    const readerRoutes = ["/borrowbooks", "/history", "/profile"];

    if (adminRoutes.includes(to.path) && role !== "NhanVien") {
      return next("/borrowbooks");
    }

    if (readerRoutes.includes(to.path) && role !== "DocGia") {
      return next("/books");
    }

    return next();
  } catch (error) {
    console.error("Lỗi giải mã token:", error);
    return next("/login");
  }
});

export default router;
