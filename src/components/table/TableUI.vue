<script setup lang="ts" generic="TData">
/**
 * Table UI Component
 *
 * Features:
 * * - Dropdown: Includes a dropdown menu with oldest and newest.
 * * - Loading State: Displays a loading indicator when data is being fetched.
 * * - search-field: Provides a customizable slot beside Sort Dropdown for Search functionality.
 * * - top-row: Provides a customizable slot at the top for Title, Search, and Sort functionality.
 *
 * Future Enhancements:
 * TODO - Pagination: Will include pagination with customizable props for better data control.
 */

import type { Table as TableType } from '@tanstack/vue-table'

import { FlexRender } from '@tanstack/vue-table'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import TableLoadingBar from './TableLoadingBar.vue'

const sortModel = defineModel('sortModel', { type: Number })
const props = defineProps<{
    table: TableType<TData>
    title?: string
    loading: boolean
}>()
</script>

<template>
    <Table>
        <TableHeader>
            <TableRow v-for="headerGroup in props.table.getHeaderGroups()" :key="headerGroup.id">
                <TableHead v-for="header in headerGroup.headers" :key="header.id">
                    <FlexRender
                        v-if="!header.isPlaceholder"
                        :render="header.column.columnDef.header"
                        :props="header.getContext()"
                    />
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <template v-if="props.loading">
                <TableRow>
                    <TableCell :colspan="props.table.getAllColumns().length" class="p-0 align-top">
                        <TableLoadingBar />
                    </TableCell>
                </TableRow>
            </template>

            <template v-else-if="props.table.getRowModel().rows?.length">
                <TableRow
                    v-for="row in props.table.getRowModel().rows"
                    :key="row.id"
                    :data-state="row.getIsSelected() ? 'selected' : undefined"
                >
                    <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                        <FlexRender
                            :render="cell.column.columnDef.cell"
                            :props="cell.getContext()"
                        />
                    </TableCell>
                </TableRow>
            </template>

            <template v-else>
                <TableRow>
                    <TableCell
                        :colspan="props.table.getAllColumns().length"
                        class="h-24 text-center"
                    >
                        No results.
                    </TableCell>
                </TableRow>
            </template>
        </TableBody>
    </Table>
</template>
