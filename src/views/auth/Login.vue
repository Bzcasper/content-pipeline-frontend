<template>
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to access your account</p>
        </div>
        <LoginForm />
        <div class="auth-footer">
          <p>
            Don't have an account?
            <router-link to="/signup">Sign up</router-link>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import LoginForm from '@/components/auth/LoginForm.vue'
  
  export default {
    name: 'Login',
    components: {
      LoginForm
    }
  }
  </script>
  
  <style scoped>
  @import "@/assets/css/auth.css";
  </style>