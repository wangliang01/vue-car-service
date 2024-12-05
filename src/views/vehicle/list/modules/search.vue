<template>
  <NCard :bordered="false" size="small">
    <NCollapse>
      <NCollapseItem :title="t('common.search')" name="vehicle-search">
        <NForm :model="searchModel" label-placement="left" :label-width="80">
          <NGrid :cols="24" :x-gap="24">
            <NFormItemGi :span="6" :label="t('menu.vehicle.brand')">
              <NSelect
                v-model:value="searchModel.brand"
                :options="brands.map(brand => ({ label: brand, value: brand }))"
                clearable
                @update:value="emit('brand-change', $event)"
              />
            </NFormItemGi>
            <NFormItemGi :span="6" :label="t('menu.vehicle.model')">
              <NSelect
                v-model:value="searchModel.model"
                :options="models.map(model => ({ label: model, value: model }))"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi :span="6" :label="t('menu.vehicle.licensePlate')">
              <NInput v-model:value="searchModel.licensePlate" clearable />
            </NFormItemGi>
          </NGrid>
          <NSpace justify="end">
            <NButton @click="reset" ghost>
                  <template #icon>
                    <div class="i-material-symbols:refresh text-16px flex-center" />
                  </template>
                  {{ t('common.reset') }}
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <div class="i-material-symbols:search text-16px flex-center" />
                  </template>
                  {{ t('common.search') }}
                </NButton>
          </NSpace>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<script setup lang="ts">
import { NCard, NCollapse, NCollapseItem, NForm, NGrid, NFormItemGi, NSelect, NInput, NSpace, NButton } from 'naive-ui';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'VehicleSearch' });

const { t } = useI18n();

const props = defineProps<{
  brands: string[];
  models: string[];
}>();

const searchModel = defineModel<Api.Vehicle.VehicleSearchParams>('searchModel', {
  default: () => ({
    customerId: '',
    brand: '',
    model: '',
    licensePlate: ''
  })
});

const emit = defineEmits<{
  search: [];
  reset: [];
  'brand-change': [brand: string];
}>();

const search = () => emit('search');
const reset = () => emit('reset');

</script>

<style scoped>
:deep(.n-button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.n-button .n-button__icon) {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* 确保图标元素有正确的尺寸 */
:deep(.n-button .n-button__icon div) {
  width: 16px;
  height: 16px;
  display: inline-flex;
}

.pr-24px {
  padding-right: 24px;
}

.flex {
  display: flex;
}

.justify-start {
  justify-content: flex-start;
}

.justify-end {
  justify-content: flex-end;
}

.gap-12px {
  gap: 12px;
}

:deep(.n-form-item .n-form-item-label) {
  font-size: 14px;
}

:deep(.n-input, .n-select) {
  width: 100%;
}

:deep(.n-select) {
  width: 100%;
}

:deep(.n-select .n-base-selection) {
  background-color: var(--n-color);
}

:deep(.n-select .n-base-selection-placeholder) {
  display: block !important;
  color: var(--n-placeholder-color) !important;
}

:deep(.n-select .n-base-selection-input) {
  color: var(--n-text-color);
}

:deep(.n-select .n-base-selection-placeholder) {
  display: block !important;
}
</style>
