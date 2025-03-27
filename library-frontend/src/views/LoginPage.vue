<template>
  <div class="login-page">
    <div class="overlay"></div>

    <LoginForm />
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";

export default {
  components: {
    LoginForm,
  },
};
</script>

<style scoped>
.login-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: url("@/assets/login.jpg") no-repeat center center fixed;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}
</style>
