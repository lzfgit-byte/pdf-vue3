<template>
  <div class="pdf-container">
    <div class="pdf-header">
      <Header
        v-model:expand="isExpandAside"
        :current-page="currentPage"
        :total-page="totalPage"
        @change-current-page="setCurrentPage"
      ></Header>
    </div>
    <div class="pdf-bottom" :class="isExpandAside ? ['pdf-expand'] : ['un-expand']">
      <ProgressBar :progress="progress"></ProgressBar>
      <div class="pdf-aside">
        <Sidebar
          :current-page="currentPage"
          :page-s="pageS"
          :is-page-s-down="isPageSDown"
          :outlines="outlines"
          :find-page="findPage"
          @update:current-page="setCurrentPage"
        ></Sidebar>
      </div>
      <div class="pdf-main">
        <div ref="scrollRef" class="pdf-viewer-container">
          <div v-for="(item, index) in contains" :key="index" class="current-pdf-page-container">
            <div :ref="item" style="position: relative"></div>
            <div style="position: absolute; bottom: 2px">{{ index + 1 }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { provide } from 'vue';
  import usePDFJs from '@/hooks/usePDFJs';
  import ProgressBar from '@/components/ProgressBar.vue';
  import Sidebar from '@/components/Sidebar.vue';
  import Header from '@/components/Header.vue';
  import usePDFState from '@/hooks/usePDFState';
  import { PDFViewerEmits } from '@/const/emits';
  const props = defineProps({
    src: String,
    gap: { type: Number, default: 6 },
    lang: Object,
    findPage: { type: Number, default: 50 },
  });
  const emits = defineEmits([...PDFViewerEmits]);
  const {
    contains,
    scrollRef,
    currentPage,
    totalPage,
    progress,
    setCurrentPage,
    pageS,
    isPageSDown,
    outlines,
    document,
  } = usePDFJs(props as any, emits);
  provide('document', document);
  provide('powerLang', props?.lang);

  const { gap, isExpandAside } = usePDFState(props as any);
  defineExpose({
    setCurrentPage,
    getCurrentPage: () => currentPage.value,
    getTotal: () => totalPage.value,
  });
</script>

<style scoped lang="less">
  @import './style/viewer';
  .pdf-container {
    --pdf-head-height: 4%;
    --pdf-render-gap: v-bind(gap);
  }
</style>
