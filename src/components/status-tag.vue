<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  status: string
}>()

const statusText = computed(() => {
  return t(`repairOrder.status.${props.status}`)
})
</script>

<template>
  <n-tag :type="getTagType(props.status)">
    {{ statusText }}
  </n-tag>
</template> 