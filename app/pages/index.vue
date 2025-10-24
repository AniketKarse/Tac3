<script setup>
import { watch } from 'vue'
import { ref } from 'vue'


const offlinePage = () => {
  
    navigateTo("/multiPlayerLoginOffline");
}
const onlinePage = () => {
  
    navigateTo("/multiPlayerLoginOnline");
}
</script>

<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Audiowide|Sofia|Trirong" />
  <NuxtLayout>
      <div class="button">
          <UButton class="rounded-full px-15" @click.stop="offlinePage()">Offline </UButton>
          <UButton class="rounded-full px-15" @click.stop="onlinePage()">Online </UButton>
        </div>
  </NuxtLayout>
</template>

<style>
.button {
  margin:auto;
  margin-top: 20px;
  width: 100%;
  text-align: center;
}
</style>
