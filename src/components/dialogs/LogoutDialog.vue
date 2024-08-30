<script setup lang="ts">
import { ExitIcon } from '@radix-icons/vue'

import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

const router = useRouter()

const logout = () => {
    Cookies.remove('template-app-token')
    router.push('/auth/login')
}
</script>

<template>
    <AlertDialog>
        <AlertDialogTrigger as-child>
            <Button variant="destructive" class="flex items-center gap-2 font-normal tracking-wide">
                <ExitIcon />
                {{ $t('common.logout') }}
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{{ $t('auth.logout-confirm-title') }}</AlertDialogTitle>
                <AlertDialogDescription>
                    {{ $t('auth.logout-confirm-description') }}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>{{ $t('common.cancel') }}</AlertDialogCancel>
                <AlertDialogAction variant="destructive" @click="logout">
                    {{ $t('common.logout') }}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
