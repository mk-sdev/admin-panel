<template>
  <div>
    <h2>Login</h2>
    <input v-model="email" type="text" placeholder="email" />
    <input v-model="password" type="password" placeholder="hasło" />
    <button @click="login">Zaloguj się</button>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const login = async () => {
  try {
    fetch('http://localhost:3000/login', {
      method: 'PATCH',
      credentials: 'include', //pozwala wysłać i odebrać cookies
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    }).then(async () => {
      router.push('/')
    })
  } catch (err: any) {
    error.value = err.message || 'Błąd logowania'
  }
}
</script>
