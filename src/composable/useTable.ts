import type { ColumnDef, TableOptions } from '@tanstack/vue-table'
import { getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { type Ref } from 'vue'

type ColumnVisibilityType = {
    [key: string]: boolean
}

// Define a generic type T for data
export function useTable<T>(
    data: Ref<T[] | undefined>,
    columns: ColumnDef<T>[],
    columnVisibility: ColumnVisibilityType,
    opt?: Partial<TableOptions<T>>
) {
    const table = useVueTable<T>({
        get data() {
            return data.value || []
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
            columnVisibility
        },
        ...opt
    })

    return { table }
}
