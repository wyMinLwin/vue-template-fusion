<script setup lang="ts">
import loginLogo from '@/assets/icons/login-logo.svg'

import { useRouter } from 'vue-router'
import * as z from 'zod'
import Cookies from 'js-cookie'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useI18n } from 'vue-i18n'
import { useLoaderStore } from '@/stores/loaderStore'
import { errorMsg } from '@/shared/messages'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast/use-toast'

const { t } = useI18n()
const router = useRouter()
const { toast } = useToast()
const { loadingOn, loadingOff } = useLoaderStore()

const formSchema = toTypedSchema(
    z.object({
        email: z
            .string({
                invalid_type_error: t(errorMsg.required),
                required_error: t(errorMsg.required)
            })
            .min(2, { message: t(errorMsg.invalidEmail) })
            .email(t(errorMsg.invalidEmail)),
        password: z
            .string({
                invalid_type_error: t(errorMsg.required),
                required_error: t(errorMsg.required)
            })
            .min(2, { message: t(errorMsg.invalidPassword) })
    })
)

const { isFieldDirty, handleSubmit } = useForm({
    validationSchema: formSchema
})

const onSubmit = handleSubmit(async (values) => {
    try {
        const url =
            'https://dev-backend-aroided.azurewebsites.net/Api/UserCustomer/UserCustomerLogin'

        loadingOn()

        const method = 'POST'
        const headers = { 'Content-Type': 'Application/json' }
        // const body = JSON.stringify({
        //     username: values.email,
        //     password: values.password
        // })
        const body = JSON.stringify({
            username: 'nanami@jjk.com',
            password: '123456789'
        })

        const res = await fetch(url, {
            method,
            headers,
            body
        })

        if (res.ok) {
            const data = await res.json()
            Cookies.set('crc-admin-token', data.userToken)

            router.push({
                path: '/',
                replace: true
            })

            toast({
                title: `You logged in with the following email: ${values.email}`,
                description: 'Successful login',
                variant: 'success'
            })
        } else {
            throw new Error()
        }
    } catch (error) {
        console.error(error)

        toast({
            title: `Login fail!`,
            description: 'An error occurred during auth. Please try again.',
            variant: 'destructive'
        })
    } finally {
        loadingOff()
    }
})
</script>

<template>
    <main class="min-h-svh login-background flex flex-col items-center justify-between py-3">
        <section></section>

        <section class="min-w-[400px] bg-white shadow rounded-lg flex flex-col items-center p-6">
            <img :src="loginLogo" alt="Central Retail" class="mb-12 w-[220px]" />

            <form class="w-full space-y-6" @submit="onSubmit">
                <FormField
                    v-slot="{ componentField }"
                    name="email"
                    :validate-on-blur="!isFieldDirty"
                >
                    <FormItem>
                        <FormLabel> {{ $t('common.email') }}</FormLabel>
                        <FormControl>
                            <Input
                                v-bind="componentField"
                                type="email"
                                :placeholder="$t('common.email')"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField
                    v-slot="{ componentField }"
                    name="password"
                    :validate-on-blur="!isFieldDirty"
                >
                    <FormItem>
                        <FormLabel class="flex items-center justify-between">
                            {{ $t('common.password') }}

                            <span
                                class="text-primary hover:underline active:underline text-xs cursor-pointer"
                            >
                                {{ $t('auth.forgot-password') }}</span
                            >
                        </FormLabel>
                        <FormControl>
                            <Input
                                v-bind="componentField"
                                type="password"
                                :placeholder="$t('common.password')"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <Button type="submit" class="hover:bg-black/90 active:bg-black/90 w-full bg-black">
                    {{ $t('common.login') }}
                </Button>
            </form>
        </section>

        <span class="text-xs">
            {{ $t('auth.dont-have-account') }}
            <strong
                class="text-primary hover:underline active:underline font-normal cursor-pointer"
            >
                {{ $t('auth.create-account') }}
            </strong>
        </span>
    </main>
</template>

<style scoped>
.login-background {
    background: conic-gradient(
            from 90deg at 1px 1px,
            #0000 90deg,

            rgb(218, 218, 218) 0
        )
        0 0/50px 50px;
}
</style>
