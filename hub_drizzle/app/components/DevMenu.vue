<script setup lang="ts">
const isDev = import.meta.dev
const items = ref([
  [
    {
      label: 'Dev Page',
      to: isDev ? '/dev/' : undefined
    },
    {
      label: 'login',
      to: isDev ? '/login' : undefined
    },
    {
      label: 'signup',
      to: isDev ? '/signup' : undefined
    },
    {
      label: 'logout',
      onSelect: async () => {
        // await useMyUserSession().clear()
        navigateTo('/')
      }
    },
  ],
])
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton
      icon="i-lucide-menu"
      color="neutral"
      variant="outline"
    />
  </UDropdownMenu>
</template>
