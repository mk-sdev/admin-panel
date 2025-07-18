<template>
  <span class="spinner"></span>
</template>

<style>
.spinner {
  display: inline-block;
  /* margin-top: 20px; */
  width: 30px;
  height: 30px;
  border: 3px solid #625747;
  border-top-color: #C5AD8A;
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
