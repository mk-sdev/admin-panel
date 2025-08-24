<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <h2>Zmiana hasła</h2>
      <form @submit.prevent="submit">
        <div class="form-group">
          <label>Aktualne hasło</label>
          <input type="password" v-model="currentPassword" required />
        </div>
        <p style="width: 80%; opacity: 0.7">
          Hasło powinno zawierać 8-30 znaków, w tym małe i duże litery, cyfry i
          znaki specjalne
        </p>
        <div class="form-group">
          <label>Nowe hasło</label>
          <input type="password" v-model="newPassword" required />
        </div>
        <div class="form-group">
          <label>Potwierdź nowe hasło</label>
          <input type="password" v-model="confirmPassword" required />
        </div>
        <div class="modal-actions">
          <button type="submit">Zmień hasło</button>
        </div>
        <button type="button" class="close-btn" @click="close">×</button>
        <span v-for="(err, index) in errorMessage" :key="index" class="error">
          {{ err }}
        </span>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref } from 'vue'

interface Props {
  isOpen: boolean
}
const { isOpen } = defineProps<Props>()

const emit = defineEmits(['close'])
import { toast } from 'vue3-toastify'
import { API_URL } from '../constants'
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const errorMessage = ref<string[]>([])

const close = () => {
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  errorMessage.value = []
  emit('close')
}

const submit = async () => {
  errorMessage.value = []

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = ['Nowe hasło i potwierdzenie nie są zgodne.']
    return
  }

  try {
    const res = await fetch(`${API_URL}/change-password`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: currentPassword.value,
        newPassword: newPassword.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      errorMessage.value = data.message || ['Błąd podczas zmiany hasła.']
      return
    }

    toast.success('Hasło zostało zmienione.', { autoClose: 1500 })
    setTimeout(close, 1500)
  } catch {
    errorMessage.value = ['Błąd sieci. Spróbuj ponownie.']
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-content {
  position: relative;
  background-color: rgb(50, 50, 60);
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}
.form-group {
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
}
.form-group label {
  text-align: left;
}
input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: rgba(70, 70, 80, 1);
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
button[type='submit'] {
  background-color: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
}
button[type='submit']:hover {
  background-color: #2980b9;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  padding: 6px 15px;
  padding-bottom: 8px;
  border-radius: 4px;
  transition: background 0.2s ease, color 0.2s ease;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffdddd;
}

.error {
  color: red;
  margin-top: 0.5rem;
}
.success {
  color: green;
  margin-top: 0.5rem;
}
</style>
