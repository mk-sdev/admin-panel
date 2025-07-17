<template>
  <div class="navbar">
    <!-- Lewy placeholder lub miejsce na logo -->
    <div class="nav-left-placeholder"></div>

    <!-- Środkowe przyciski -->
    <div class="nav-center-buttons">
      <button
        :class="{ 'active-route': route.path === '/' }"
        @click="router.push('/')"
      >
        Strona główna
      </button>

      <!-- <button @click="router.push('/')">Dni2</button> -->
    </div>

    <!-- Prawy logout -->
    <div class="nav-logout">
      <button @click="logout">Wyloguj się</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const route = useRoute()
import { useRoute } from 'vue-router'
import { API_URL } from '../constants'
const router = useRouter()

const logout = () => {
  fetch(`${API_URL}/logout`, {
    method: 'PATCH',
    credentials: 'include',
  }).then(() => {
    router.push('/login')
  })
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  border-bottom: 1px solid #3f3f3f;
  background-color: rgba(33, 33, 39, 0.9);
  backdrop-filter: blur(6px); 
  -webkit-backdrop-filter: blur(6px); /* Safari */
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
  gap: 0.5rem;
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
  transition: background-color 0.2s ease, box-shadow 0.2s ease, border-bottom-color 0.2s ease;
}

.nav-center-buttons button:hover {
  background-color: rgba(50, 50, 60, 0.8);
  border-bottom-color: rgb(116, 116, 137);
}

.nav-center-buttons .active-route {
  border-bottom: 2px solid rgb(116, 116, 137);
}


.nav-logout button {
  margin-right: 25px; /* bez tego scroll bar zasłania */
  font-weight: bold;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: rgb(220, 59, 31);
}

/* Media query: jeśli szerokość poniżej 500px, przyciski idą na lewo */
@media (max-width: 500px) {
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
