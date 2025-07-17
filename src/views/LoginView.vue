<template>
  <form @submit.prevent="login">
    <h2>Login</h2>
    <input v-model="email" type="text" placeholder="email" />
    <input v-model="password" type="password" placeholder="hasło" />
    <button type="submit" :disabled="isLoading">
      <span>Zaloguj się</span>
    </button>

  </form>
  <p v-if="error" style="color: red">{{ error }}</p>
  <Spinner v-if="isLoading"/>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { API_URL } from '../constants'
import Spinner from '../components/Spinner.vue'

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const router = useRouter()

const login = async () => {
  error.value = ''
  isLoading.value = true
  try {
    const res = await fetch(`${API_URL}/login`, {
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
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  margin: auto
}
input {
  display: block;
  margin-bottom: 1rem;
  padding: 0.5rem;
  width: 100%;
  max-width: 300px;
}


</style>
