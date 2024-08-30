<script setup lang="ts">
import { ChevronRightIcon } from '@radix-icons/vue'

import { useRoute } from 'vue-router'

import { sidebarData } from '.'
import LogoutDialog from '@/components/dialogs/LogoutDialog.vue'

const route = useRoute()

const highlightEntry = (routes: string[]) => {
    const result = {
        class: ''
    }

    if (routes.includes(route.name?.toString()!)) {
        result.class = 'bg-primary text-primary-foreground font-medium'

        return result
    }

    return result
}
</script>

<template>
    <section class="lg:flex flex-col hidden min-h-svh min-w-[220px] lg:min-w-[240px] bg-white h-full">
        <div class="flex flex-col items-center justify-center h-20">
            <h5 class="text-xl font-bold leading-4 cursor-pointer" @click="$router.push('/')">
                {{ $t('common.dashboard') }} <span class="text-[8px]">v.01</span>
            </h5>
            <h4
                class="text-[10px] leading-[0.75] font-bold tracking-normal cursor-pointer"
                @click="$router.push('/')"
            >
                <b class="text-[#f9b223] font-semibold"> FUSION </b>
                SOLUTION
            </h4>
        </div>

        <div class="px-3">
            <div
                v-for="item in sidebarData"
                :key="item.name"
                class="flex items-center justify-between p-2 mb-3 rounded-sm cursor-pointer"
                :class="highlightEntry(item.routeNames).class"
                @click="$router.push({ name: item.routeNames[0] })"
            >
                <div class="flex items-center gap-3">
                    <component :is="item.icon"></component>

                    <p class="text-[13px]">
                        {{ $t(item.name) }}
                    </p>
                </div>

                <ChevronRightIcon v-if="item.subMenu" />
            </div>
        </div>

        <div class="flex justify-center w-full pb-4 mt-auto">
            <LogoutDialog class="mt-auto" />
        </div>
    </section>
</template>
