<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const statusOptions = ['Not Started', 'In Progress', 'Completed']
const formSchema = toTypedSchema(
    z.object({
        title: z
            .string({ required_error: t('error-msg.required') })
            .min(1, { message: t('error-msg.required') }),
        description: z
            .string({ required_error: t('error-msg.required') })
            .min(1, { message: t('error-msg.required') }),
        status: z.enum(['Not Started', 'In Progress', 'Completed'],{required_error: t('error-msg.required')})
    })
)

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        title: '',
        description: ''
    }
})

const onSubmit = form.handleSubmit(async (values) => {
    console.log(values)
})
</script>

<template>
    <Dialog>
        <DialogTrigger>
            <slot></slot>
        </DialogTrigger>
        <DialogContent
            class="w-[95vw] sm:w-[400px] max-w-[400px]"
            @open-auto-focus="(e) => e.preventDefault()"
        >
            <DialogHeader>
                <DialogTitle>Add New Todo</DialogTitle>
                <form @submit="onSubmit" class="gap-3">
                    <FormField v-slot="{ componentField }" name="title">
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl class="">
                                <Input
                                    type="text"
                                    placeholder="Enter title..."
                                    v-bind="componentField"
                                    aria-label="title form field"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="description">
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter description..."
                                    v-bind="componentField"
                                    aria-label="description form field"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="status">
                        <FormItem>
                            <FormLabel>Status</FormLabel>

                            <Select v-bind="componentField">
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue class="capitalize" placeholder="Select a status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem
                                            class="capitalize"
                                            v-for="option in statusOptions"
                                            :key="option"
                                            :value="option"
                                        >{{ option }}</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <div class="mt-3 flex justify-center items-center gap-2">
                        <DialogClose class="w-[120px]">
                            <Button
                                type="button"
                                class="w-full bg-destructive hover:bg-destructive/80"
                                >Cancel</Button
                            >
                        </DialogClose>
                        <Button class="w-[120px]" type="submit">Submit</Button>
                    </div>
                </form>
            </DialogHeader>
            <TodoForm />
        </DialogContent>
    </Dialog>
</template>
