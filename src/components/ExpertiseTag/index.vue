<template>
  <div class="expertise-tags" @mouseenter="showAll = true" @mouseleave="showAll = false">
    <template v-if="!showAll">
      <el-tag v-for="(tag, index) in visibleTags" :key="index" class="tag" size="small">
        {{ t(tag) }}
      </el-tag>
      <el-tag v-if="remainingCount > 0" size="small" type="info">
        +{{ remainingCount }}
      </el-tag>
    </template>
    
    <template v-else>
      <el-tag v-for="(tag, index) in tags" :key="index" class="tag" size="small">
        {{ t(tag) }}
      </el-tag>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  tags: string[]
}>()

const showAll = ref(false)
const maxVisibleTags = 2

const visibleTags = computed(() => {
  return props.tags.slice(0, maxVisibleTags)
})

const remainingCount = computed(() => {
  return Math.max(0, props.tags.length - maxVisibleTags)
})
</script>

<style scoped>
.expertise-tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag {
  margin-right: 4px;
}
</style> 