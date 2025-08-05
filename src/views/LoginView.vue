<template>
  <form @submit.prevent="handleLogin">
    <h2>Panel administratora</h2>
    <input v-model="login" type="text" placeholder="login" />
    <input v-model="password" type="password" placeholder="hasło" />
    <Spinner v-if="isLoading" style="margin-top: 20px" />
    <button v-else type="submit" :disabled="isLoading">
      <span>Zaloguj się</span>
    </button>
  </form>
  <div v-if="Array.isArray(error)">
    <p v-for="err in error" :key="err" style="color: red">{{ err }}</p>
  </div>
  <p v-else-if="error" style="color: red">{{ error }}</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { API_URL } from '../constants'
import Spinner from '../components/Spinner.vue'

const login = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: login.value, password: password.value }),
    })

    if (!res.ok) {
      if (res.status === 401) {
        error.value = 'Nieprawidłowy login lub hasło.'
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
  margin: auto;
}
input {
  display: block;
  margin-bottom: 1rem;
  padding: 0.5rem;
  width: 100%;
  max-width: 300px;
}
</style>
