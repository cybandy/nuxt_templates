<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth',
  middleware: ['guest']
})

useSeoMeta({
  title: 'Login',
  description: 'Login to your account to continue'
})

const toast = useToast()

const fields = [{
  name: 'email',
  type: 'text' as const,
  label: 'Email',
  placeholder: 'Enter your email',
  required: true
}, {
  name: 'password',
  label: 'Password',
  type: 'password' as const,
  placeholder: 'Enter your password'
}, {
  name: 'remember',
  label: 'Remember me',
  type: 'checkbox' as const
}]

const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  onClick: () => {
    toast.add({ title: 'Google', description: 'Login with Google' })
    navigateTo('/auth/google', { open: { target: '_parent' } })
  }
}, {
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  onClick: () => {
    toast.add({ title: 'GitHub', description: 'Login with GitHub' })
    navigateTo('/auth/github', { open: { target: '_parent' } })
  }
}]

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const { fetch: fetchSession } = useMyUserSession()

const error = ref({
  status: false,
  msg: ''
})

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    await $fetch('/auth/login', {
      method: 'POST',
      body: payload.data
    })

    await fetchSession()

    toast.add({ title: 'Welcome Back' })
    navigateTo('/')
  } catch (err) {
    error.value = { status: true, msg: 'Error signing in' }
  }
}

watch(error, () => {
  if (error.value.status) {
    setTimeout(() => {
      error.value = { status: false, msg: '' }
    }, 4000)
  }
})
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :providers="providers"
    title="Welcome back"
    icon="i-lucide-lock"
    @submit="onSubmit"
  >
    <template #description>
      Don't have an account? <ULink
        to="/signup"
        class="text-primary font-medium"
      >Sign up</ULink>.
    </template>

    <template #password-hint>
      <ULink
        to="/"
        class="text-primary font-medium"
        tabindex="-1"
      >Forgot password?</ULink>
    </template>

    <template #validation>
      <UAlert
        v-if="error.status"
        color="error"
        icon="i-lucide-info"
        :title="error.msg"
      />
    </template>

    <template #footer>
      By signing in, you agree to our <ULink
        to="/"
        class="text-primary font-medium"
      >Terms of Service</ULink>.
    </template>
  </UAuthForm>
</template>
