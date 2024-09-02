<script setup lang="ts" generic="TData">
import { Share2Icon } from '@radix-icons/vue'
import type { ColumnDef, Row } from '@tanstack/vue-table'

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { useI18n } from 'vue-i18n'
import { useLoaderStore } from '@/stores/loaderStore'

import { Button } from '@/components/ui/button'

const { t } = useI18n()
const { loadingOn, loadingOff } = useLoaderStore()

const props = defineProps<{
    columns: ColumnDef<any>[]
    excludedColumns?: string[]
    groupBy?: string
    sheetName: string
    data: Row<any>[]
    class?: string
}>()

async function exportToExcel() {
    try {
        loadingOn()

        // header
        const removedHeaders = [
            t('th.action'),
            t('th.number'),
            t('th.detail'),
            ...(props.excludedColumns || []),
            null
        ]
        const columnHeader = props.columns
            .map((c) => {
                // @ts-ignore
                const accessorKey = c?.accessorKey

                // @ts-ignore
                const vnode = typeof c.header === 'function' ? c.header() : null

                if (vnode && vnode.props && vnode.props.text) {
                    return { title: t(vnode.props.text), accessorKey }
                }

                return { title: null, accessorKey }
            })
            .filter((t) => !removedHeaders.includes(t.title))

        // data
        const mappedData = props.data.map((item) => item.original)

        const workbook = new ExcelJS.Workbook()
        if (props.groupBy) {
            const groupedData = mappedData.reduce((acc, curr) => {
                const key = curr[props.groupBy as string]
                if (!acc[key]) {
                    acc[key] = []
                }
                acc[key].push(curr)
                return acc
            }, {})

            Object.keys(groupedData).forEach((key) => {
                const worksheet = workbook.addWorksheet(key)
                worksheet.addRow(columnHeader.map((h) => h.title))
                worksheet.getRow(1).eachCell((cell, colNumber) => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'EF3225' },
                        bgColor: { argb: 'EF3225' }
                    }

                    cell.font = {
                        name: 'Calibri',
                        size: 11,
                        color: { argb: 'F6F7F9' },
                        bold: true
                    }

                    cell.alignment = { vertical: 'middle', horizontal: 'center' }

                    const column = worksheet.getColumn(colNumber)
                    column.width = 40
                })

                groupedData[key].forEach((d: any) => {
                    const keys = columnHeader.map((h) => h.accessorKey)
                    // @ts-ignore
                    const values = keys.map((k) => d[k])

                    worksheet.addRow(Object.values(values))
                })

                worksheet.eachRow((row) => {
                    row.eachCell((cell) => {
                        cell.alignment = {
                            vertical: 'middle',
                            horizontal: 'center',
                            wrapText: true
                        }
                    })
                })
            })
        } else {
            const worksheet = workbook.addWorksheet(props.sheetName)
            worksheet.addRow(columnHeader.map((h) => h.title))
            worksheet.getRow(1).eachCell((cell, colNumber) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'EF3225' },
                    bgColor: { argb: 'EF3225' }
                }

                cell.font = {
                    name: 'Calibri',
                    size: 11,
                    color: { argb: 'F6F7F9' },
                    bold: true
                }

                cell.alignment = { vertical: 'middle', horizontal: 'center' }

                const column = worksheet.getColumn(colNumber)
                column.width = 40
            })

            mappedData.forEach((d) => {
                const keys = columnHeader.map((h) => h.accessorKey)
                // @ts-ignore
                const values = keys.map((k) => d[k])

                worksheet.addRow(Object.values(values))
            })

            worksheet.eachRow((row) => {
                row.eachCell((cell) => {
                    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
                })
            })
        }

        // Generate a buffer from the workbook
        const buffer = await workbook.xlsx.writeBuffer()
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

        saveAs(blob, `${new Date().toLocaleString()}-${props.sheetName}`)
    } catch (error) {
        console.error(error)
    } finally {
        loadingOff()
    }
}
</script>

<template>
    <Button @click="exportToExcel" variant="default" :class="props.class">
        <Share2Icon class="w-4 h-4 mr-1" />
        {{ $t('common.export-excel') }}
    </Button>
</template>
