<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const navLinks: NavigationMenuItem[] = [{
  label: 'Home',
  icon: 'i-lucide-home',
  to: '/'
}, {
  label: 'Projects',
  icon: 'i-lucide-folder',
  to: '#'
}, {
  label: 'Blog',
  icon: 'i-lucide-file-text',
  to: '#'
}, {
  label: 'About',
  icon: 'i-lucide-user',
  to: '#'
}]
</script>

<template>
  <UMain>
    <AppHeader :links="navLinks" />
    <slot />
    <AppFooter />
  </UMain>
</template>

<style scoped></style>
