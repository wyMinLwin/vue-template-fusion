import type { ColumnDef } from '@tanstack/vue-table'
import type { LogEntryType } from '@/api/log/types'

import { h } from 'vue'
import { TranslatedTH } from '@/components/table'

export const columns: ColumnDef<LogEntryType>[] = [
    // {
    //     accessorKey: 'number',
    //     header: () => h(TranslatedTH, { text: 'fields.number' }),
    //     cell: ({ row, table }) => {
    //         const sortedIndex = table.getSortedRowModel().rows.findIndex((r) => r.id === row.id)

    //         return h('div', sortedIndex + 1 + '.')
    //     }
    // },
    {
        accessorKey: 'logId',
        header: () => h(TranslatedTH, { text: 'fields.logId' }),
        cell: ({ row }) => {
            return h('div', row.original.logId)
        }
    },
    {
        accessorKey: 'ip',
        header: () => h(TranslatedTH, { text: 'fields.ip' }),
        cell: ({ row }) => {
            return h('div', row.original.ip)
        }
    },
    {
        accessorKey: 'description',
        header: () => h(TranslatedTH, { text: 'fields.description' }),
        cell: ({ row }) => {
            return h('div', row.original.description)
        }
    },
    {
        accessorKey: 'exception',
        header: () => h(TranslatedTH, { text: 'fields.exception' }),
        cell: ({ row }) => {
            return h('div', row.original.exception)
        }
    },
    {
        accessorKey: 'laptopModel',
        header: () => h(TranslatedTH, { text: 'fields.laptopModel' }),
        cell: ({ row }) => {
            return h('div', row.original.laptopModel ?? '')
        }
    },
    {
        accessorKey: 'logTrace',
        header: () => h(TranslatedTH, { text: 'fields.logTrace' }),
        cell: ({ row }) => {
            return h('div', row.original.logTrace)
        }
    },
    {
        accessorKey: 'logType',
        header: () => h(TranslatedTH, { text: 'fields.logType' }),
        cell: ({ row }) => {
            return h('div', row.original.logType)
        }
    },
    {
        accessorKey: 'methodName',
        header: () => h(TranslatedTH, { text: 'fields.methodName' }),
        cell: ({ row }) => {
            return h('div', row.original.methodName)
        }
    },
    {
        accessorKey: 'userName',
        header: () => h(TranslatedTH, { text: 'fields.userName' }),
        cell: ({ row }) => {
            return h('div', row.original.userName)
        }
    },
    {
        accessorKey: 'createdAt'
    }
]

export const columnVisibility = {
    createdAt: false
}
