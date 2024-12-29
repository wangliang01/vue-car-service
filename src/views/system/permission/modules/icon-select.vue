<script setup lang="ts">
import { h } from 'vue';
import { NPopselect, NIcon, NButton } from 'naive-ui';
import { Icon } from '@iconify/vue';

interface Props {
  value?: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: ''
});

const emit = defineEmits<{
  'update:value': [value: string];
}>();

const icons = [
  { label: '首页', value: 'carbon:home', icon: 'carbon:home' },
  { label: '用户', value: 'carbon:user', icon: 'carbon:user' },
  { label: '设置', value: 'carbon:settings', icon: 'carbon:settings' },
  { label: '文档', value: 'carbon:document', icon: 'carbon:document' },
  { label: '菜单', value: 'carbon:menu', icon: 'carbon:menu' },
];

function renderIcon(iconName: string) {
  return () => h(Icon, { icon: iconName });
}

function handleSelect(value: string) {
  emit('update:value', value);
}
</script>

<template>
  <NPopselect
    :value="value"
    :options="icons.map(item => ({
      label: item.label,
      value: item.value,
      render: renderIcon(item.icon)
    }))"
    @update:value="handleSelect"
  >
    <NButton>
      <template #icon>
        <Icon v-if="value" :icon="value" />
      </template>
      {{ value ? icons.find(i => i.value === value)?.label : '请选择图标' }}
    </NButton>
  </NPopselect>
</template> 