<template>
  <div class="pdf-header-container">
    <div class="header-left">
      <div class="icon-container" @click="emits('update:expand', !expand)">
        <PDFIcons :width="24" :height="24" type="sidebar"></PDFIcons>
      </div>
    </div>
    <div class="header-mid">
      <span>
        <input ref="inputRef" :value="currentPage" @blur="handlerInputBlur" /> /
        {{ totalPage }}
      </span>
    </div>
    <div class="header-right"></div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import PDFIcons from '@/components/PDFIcons.vue';

  defineProps({ currentPage: Number, totalPage: Number, expand: Boolean });
  const emits = defineEmits(['update:expand', 'changeCurrentPage']);
  const inputRef = ref();
  const handlerInputBlur = () => {
    emits('changeCurrentPage', +inputRef.value.value);
  };
</script>

<style scoped lang="less">
  @import '../style/header';
</style>
