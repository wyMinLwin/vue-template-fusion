<script setup lang="ts">
import { fetchHistoryByID } from '@/api/text-to-speech/queries';
import { watch } from 'vue';

const props = defineProps<{
    id: string
}>()
const emits = defineEmits(['update:chat'])

const {data,isSuccess, refetch} = fetchHistoryByID.useQuery(props.id)

watch(() => props.id, (newId) => {
    refetch()
})

watch(isSuccess, (success) => {
    if(success){
        emits('update:chat',data.value)
    }
})

</script>

<template>
    <div class="hidden">
    </div>
</template>