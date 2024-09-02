<script lang="ts" setup>
import { fetchLogs } from '@/api/log/queries.ts'

const { data } = fetchLogs.useQuery()
console.log("🚀 ~ data:", data)
</script>

<template>
    <div class="p-3">
        <h1 class="text-xl">Log!</h1>

        {{ data }}
    </div>
</template>
