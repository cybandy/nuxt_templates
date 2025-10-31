<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const props = withDefaults(defineProps<ButtonProps>(), {})

const _ = ref<ButtonProps>({
  icon: 'i-lucide-arrow-up',
  variant: 'ghost',
  color: 'neutral',
})
onMounted(() => {
//   _.value = {
//     ..._.value,
//     ...props
//   }
})

const { x, y } = useWindowScroll()

const showScrollUp = computed(() => y.value >= 500)

const scrollUp = () => {
  y.value = 0
}
</script>

<template>
  <UButton
    v-if="showScrollUp"
    v-bind="_"
    class=" z-10 fixed bottom-2 md:bottom-6 right-2 md:right-3 lg:right-6"
    @click="scrollUp"
  />
</template>