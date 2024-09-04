<script setup lang="ts">
import { Sidebar } from './common'
</script>

<template>
    <div class="h-svh flex overflow-hidden">
        <aside>
            <Sidebar />
        </aside>
        <main class="w-full min-h-full overflow-y-auto">
            <!-- <header class="lg:justify-end flex justify-between w-full p-3 pb-2">
                <MobileSidebar />

                <ProfileBox />
            </header> -->

            <RouterView />
        </main>
    </div>
</template>
