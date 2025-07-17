<template>
  <span class="spinner"></span>
</template>

<style>
.spinner {
  display: inline-block;
  margin-top: 20px;
  width: 18px;
  height: 18px;
  border: 3px solid rgba(0, 0, 0, 0.2);
  border-top-color: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
