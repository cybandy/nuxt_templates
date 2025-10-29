<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth',
  middleware: ['guest']
})

useSeoMeta({
  title: 'Sign up',
  description: 'Create an account to get started'
})

const toast = useToast()

const fields = [
  {
    name: 'firstName',
    type: 'text' as const,
    label: 'First Name',
    placeholder: 'Enter your first name'
  },
  {
    name: 'lastName',
    type: 'text' as const,
    label: 'Last Name',
    placeholder: 'Enter your last name'
  },
  {
    name: 'email',
    type: 'text' as const,
    label: 'Email',
    placeholder: 'Enter your email'
  }, {
    name: 'password',
    label: 'Password',
    type: 'password' as const,
    placeholder: 'Enter your password'
  }]

const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  onClick: () => {
    toast.add({ title: 'Google', description: 'Login with Google' })
  }
}, {
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  onClick: () => {
    toast.add({ title: 'GitHub', description: 'Login with GitHub' })
  }
}]

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
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
    await $fetch('/auth/reg', {
      method: 'POST',
      body: payload.data
    })

    toast.add({ title: 'Welcome Back' })
    navigateTo('/')

    await fetchSession()
  } catch (err) {
    error.value = { status: true, msg: 'Error in registration. Try again' }
  }
  console.log('Submitted', payload.data)
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :providers="providers"
    title="Create an account"
    :submit="{ label: 'Create account' }"
    @submit="onSubmit"
  >
    <template #description>
      Already have an account? <ULink
        to="/login"
        class="text-primary font-medium"
      >Login</ULink>.
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
      By signing up, you agree to our <ULink
        to="/"
        class="text-primary font-medium"
      >Terms of Service</ULink>.
    </template>
  </UAuthForm>
</template>
