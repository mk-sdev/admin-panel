<template>
  <div class="navbar">
    <!-- Lewy placeholder -->
    <div class="nav-left-placeholder"></div>

    <!-- Środkowe przyciski -->
    <div class="nav-center-buttons">
      <button
        :class="{ 'active-route': route.path === '/' }"
        @click="router.push('/')"
      >
        Lista publikacji
      </button>
      <button
        :class="{ 'active-route': route.path === '/pomoc' }"
        @click="router.push('/pomoc')"
      >
        Pomoc
      </button>
    </div>

    <!-- Menu z trzema kropkami -->
    <div class="nav-menu">
      <button class="dots-btn" @click="toggleMenu">⋮</button>
      <div v-if="menuOpen" class="menu-popup">
        <span style="line-height: 40px; opacity: 0.7">{{
          login || '...'
        }}</span>

        <button @click="openChangePasswordModal">Zmień hasło</button>
        <button id="logout" @click="logout">
          <Spinner
            v-if="isLoading"
            style="
              width: 16px;
              height: 16px;
              border: 2px solid rgb(170, 0, 0);
              border-top-color: maroon;
              margin-right: 6px;
            "
          />
          <span v-else>Wyloguj się</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Modal zmiany hasła -->
  <ChangePasswordModal :isOpen="modalOpen" @close="closeModal" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Spinner from './Spinner.vue'
import { useRouter, useRoute } from 'vue-router'
import { API_URL } from '../constants'
import ChangePasswordModal from './ChangePasswordModal.vue'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const menuOpen = ref(false)
const modalOpen = ref(false)
const login = ref('') 

const openChangePasswordModal = () => {
  modalOpen.value = true
  menuOpen.value = false
}
const closeModal = () => {
  modalOpen.value = false
}

// Pobranie danych użytkownika
onMounted(async () => {
  try {
    const res = await fetch(`${API_URL}/userinfo`, { credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      login.value = data.login || '' 
    }
  } catch (err) {
    console.error('Błąd pobierania danych użytkownika', err)
  }
})

// MENU
const toggleMenu = () => (menuOpen.value = !menuOpen.value)
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.nav-menu')) menuOpen.value = false
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

// LOGOUT
const logout = () => {
  isLoading.value = true
  fetch(`${API_URL}/logout`, { method: 'PATCH', credentials: 'include' }).then(
    () => router.push('/login')
  )
}
</script>

<style scoped>
/* Navbar */
* {
  transition: all 0.2s ease;
}
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  border-bottom: 1px solid #3f3f3f;
  background-color: rgba(33, 33, 39, 0.9);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 1000;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;
}
.nav-left-placeholder {
  width: 120px;
}
.nav-center-buttons {
  display: flex;
}
.nav-center-buttons button {
  background-color: rgba(50, 50, 60, 0.1);
  color: #fff;
  font-weight: bold;
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 0;
  height: 52px;
  border-bottom: 2px solid transparent;
}
.nav-center-buttons button:hover {
  background-color: rgba(50, 50, 60, 0.8);
}
.nav-center-buttons .active-route {
  border-bottom: 2px solid rgb(116, 116, 137);
}

/* Menu */
.nav-menu {
  position: relative;
  margin-right: 25px;
}
.dots-btn {
  font-size: 22px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px 12px;
}
.dots-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
.menu-popup {
  position: absolute;
  right: 0;
  top: 35px;
  background: #2d2d35;
  border: 1px solid #444;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  min-width: 150px;
  z-index: 2000;
}
.menu-popup button {
  width: 100%;
  text-align: center;
  padding: 10px 14px;
  background: none;
  border: none;
  border-top: 1px solid #444;
  border-radius: 0;
  color: white;
  cursor: pointer;
  font-weight: 500;
}
.menu-popup button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
#logout {
  background-color: rgb(204, 57, 29);
  border-radius: 0 0 5px 5px;
}
#logout:hover {
  background-color: rgb(179, 47, 24);
}

/* mobile responsiveness */
@media (max-width: 550px) {
  .navbar {
    justify-content: space-between;
  }
  .nav-left-placeholder {
    display: none;
  }
  .nav-center-buttons {
    order: -1;
    margin-right: auto;
  }
}
</style>
