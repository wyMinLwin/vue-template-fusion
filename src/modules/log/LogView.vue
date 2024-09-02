<script lang="ts" setup>
import { fetchLogs } from '@/api/log/queries'
import { TableUI } from '@/components/table'
import { useTable } from '@/composable/useTable'
import { columns, columnVisibility } from './columns/columns'

const { data, isLoading } = fetchLogs.useQuery()

const { table } = useTable(data, columns, columnVisibility)
</script>

<template>
    <div class="p-3 space-y-3">
        <h1 class="text-xl font-bold">Log!</h1>
        <p class="text-primary text-sm font-light">useTable (Composable) / Shadcn Table UI</p>

        <div class="bg-white rounded">
            <TableUI :table="table" :loading="isLoading"></TableUI>
        </div>
    </div>
</template>
