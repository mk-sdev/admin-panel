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
  error.value = ''

  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })

    if (!res.ok) {
      if (res.status === 401) {
        error.value = 'Nieprawidłowy email lub hasło.'
      } else {
        const data = await res.json().catch(() => ({}))
        error.value = data.message || `Błąd: ${res.status}`
      }
      return
    }

    router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Błąd połączenia z serwerem.'
  }
}
</script>

<style>
input {
  display: block;
  margin-bottom: 1rem;
  padding: 0.5rem;
  width: 100%;
  max-width: 300px;
}
</style>
