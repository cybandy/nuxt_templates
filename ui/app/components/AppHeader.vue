<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()
</script>

<template>
  <UHeader
    mode="slideover"
  >
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="size-10 shrink-0" />
      </NuxtLink>
    </template>

    <UNavigationMenu
      :items="links"
      variant="link"
    >
    </UNavigationMenu>

    <template #right>
      <UColorModeButton />

      <UButton
        color="primary"
        variant="solid"
        to="#"
        label="Join Us"
      />
    </template>

    <template #body>
      <UNavigationMenu
        :items="links"
        orientation="vertical"
        class="-mx-2.5"
      />

      <USeparator class="my-6" />

      <UButton
        label="Join Us"
        color="primary"
        variant="solid"
        to="#"
        block
        class="mb-3"
      />
      <UButton
        label="Sign in"
        color="neutral"
        variant="subtle"
        to="/login"
        block
        class="mb-3"
      />
      <UButton
        label="Sign up"
        color="neutral"
        to="/signup"
        block
      />
    </template>
  </UHeader>
</template>
