<script lang="ts" setup>
import { fetchLogs } from '@/api/log/queries'
import { TableUI } from '@/components/table'
import { useTable } from '@/composable/useTable'
import { columns, columnVisibility } from './columns/columns'
import { Input } from '@/components/ui/input'
import type { ColumnFiltersState } from '@tanstack/vue-table'
import { getFilteredRowModel } from '@tanstack/vue-table'
import { valueUpdater } from '@/lib/utils'
import { ref } from 'vue'

const columnFilters = ref<ColumnFiltersState>([])

const { data, isLoading } = fetchLogs.useQuery()

const { table } = useTable(data, columns, columnVisibility, {
    onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
        get columnFilters() {
            return columnFilters.value
        }
    }
})
</script>

<template>
    <div class="p-3 space-y-3">
        <h1 class="text-xl font-bold">Log!</h1>
        <p class="text-primary text-sm font-light">useTable (Composable) / Shadcn Table UI</p>

        <section class="bg-white rounded">
            <div class="flex justify-end w-full p-3">
                <Input
                    class="max-w-sm"
                    placeholder="Filter Description..."
                    :model-value="table.getColumn('description')?.getFilterValue() as string"
                    @update:model-value="table.getColumn('description')?.setFilterValue($event)"
                />
            </div>

            <TableUI :table="table" :loading="isLoading"></TableUI>
        </section>
    </div>
</template>
