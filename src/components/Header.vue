<template>
  <div class="pdf-header-container">
    <div class="header-left">
      <div class="icon-container" @click="emits('update:expand', !expand)">
        <PDFIcons :width="24" :height="24" type="sidebar"></PDFIcons>
      </div>
      <div class="page-total-container">
        <span>
          <input ref="inputRef" :value="currentPage" @blur="handlerInputBlur" /> /
          {{ totalPage }}
        </span>
      </div>
    </div>
    <div class="header-mid">
      <div class="scalar-container">
        <div class="scalar-down-up">
          <div class="icon-container" @click="increaseZoom">
            <PDFIcons :width="22" :height="22" type="plus"></PDFIcons>
          </div>
          <span>|</span>
          <div class="icon-container" @click="decreaseZoom">
            <PDFIcons :width="22" :height="22" type="minus"></PDFIcons>
          </div>
        </div>
        <div class="scalar-select">
          <div class="select-hover">
            <span>{{ translateZoomValue }}</span>
            <div class="icon-container">
              <PDFIcons :width="16" :height="16" type="down"></PDFIcons>
            </div>
          </div>
          <select v-model="zoomValue" @change="handlerZoomChange">
            <option v-for="(item, index) in zoomOpts" :key="index" :value="item.value">
              {{ item.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="header-right"></div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import PDFIcons from '@/components/PDFIcons.vue';
  import {
    decreaseZoom,
    handlerZoomChange,
    increaseZoom,
    translateZoomValue,
    zoomOpts,
    zoomValue,
  } from '@/hooks/usePDFZoom';

  defineProps({ currentPage: Number, totalPage: Number, expand: Boolean, setScale: Function });
  const emits = defineEmits(['update:expand', 'changeCurrentPage']);
  const inputRef = ref();

  const handlerInputBlur = () => {
    emits('changeCurrentPage', +inputRef.value.value);
  };
</script>

<style scoped lang="less">
  @import '../style/header';
</style>
