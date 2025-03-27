<template>
  <div class="register-page">
    <div class="overlay"></div>

    <RegisterForm />
  </div>
</template>

<script>
import RegisterForm from "@/components/RegisterForm.vue";

export default {
  components: {
    RegisterForm,
  },
};
</script>

<style scoped>
.register-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: url("@/assets/register.jpg") no-repeat center center fixed;
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
