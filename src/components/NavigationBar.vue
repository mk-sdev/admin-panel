<template>
  <div class="navbar">
    <!-- Lewy placeholder lub miejsce na logo -->
    <div class="nav-left-placeholder"></div>

    <!-- Środkowe przyciski -->
    <div class="nav-center-buttons">
      <button @click="router.push('/')">Dni</button>
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

const router = useRouter()
const logout = () => {
  fetch('http://localhost:3000/logout', {
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
  background-color: rgb(25, 25, 25);
  border-bottom: 1px solid #ccc;
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

.nav-center-buttons button,
.nav-logout button {
  margin-right: 25px; /* bez tego scroll bar zasłania */
  background-color: #999;
  font-weight: bold;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.nav-logout button {
  background-color: tomato;
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
