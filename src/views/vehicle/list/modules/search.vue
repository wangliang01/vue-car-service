<template>
  <NCard :bordered="false" size="small">
    <NCollapse :default-expanded-names="['0']">
      <NCollapseItem :title="t('common.search')" name="0">
        <NForm :model="searchModel" label-placement="left" :label-width="80">
          <NGrid :cols="24" :x-gap="24">
            <NFormItemGi :span="6" :label="t('menu.vehicle.brand')">
              <NSelect v-model:value="searchModel.brand" filterable
                :options="brands.map(brand => ({ label: brand, value: brand }))" clearable
                @update:value="handleBrandChange" />
            </NFormItemGi>
            <NFormItemGi :span="6" :label="t('menu.vehicle.model')">
              <NSelect v-model:value="searchModel.model" filterable
                :options="models.map(model => ({ label: model, value: model }))" clearable
                @update:value="handleModelChange" />
            </NFormItemGi>
            <NFormItemGi :span="6" :label="t('menu.vehicle.licensePlate')">
              <NInput v-model:value="searchModel.licensePlate" clearable />
            </NFormItemGi>
            <NFormItemGi :span="6" class="justify-end flex">
              <NSpace justify="end" >
                <NButton @click="reset" ghost>
                  <template #icon>
                    <div class="i-material-symbols:refresh text-16px flex-center" />
                  </template>
                  {{ t('common.reset') }}
                </NButton>
                <NButton type="primary"  @click="search">
                  <template #icon>
                    <div class="i-material-symbols:search text-16px flex-center" />
                  </template>
                  {{ t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>

        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<script setup lang="ts">
import { nextTick } from 'vue';
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
    customerId: null,
    brand: null,
    model: null,
    licensePlate: null
  })
});

const emit = defineEmits<{
  search: [];
  reset: [];
}>();

function handleBrandChange(value: string) {
  nextTick(() => {
    emit('search');
  });
}

function handleModelChange(value: string) {
  nextTick(() => {
    emit('search');
  });
}

const search = () => emit('search');
const reset = () => emit('reset');

</script>

<style scoped>

</style>
