<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import { useI18n } from 'vue-i18n';

const {t} = useI18n()
</script>

<template>
  <div class="">
    <h1 class="text-xl">Vue Starter Fusion Template</h1>
    <Button>{{t('common.click-me')}}</Button>
  </div>
</template>
