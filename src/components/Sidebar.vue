<template>
  <div class="side-bar-container">
    <div class="side-bar-top">
      <div
        class="icon-container"
        :class="activeTab === 'thumb' ? ['icon-container-active'] : []"
        :title="powerLang['sideBar.thumb']"
        @click="activeTab = 'thumb'"
      >
        <PDFIcons :width="22" :height="22" type="thumb"></PDFIcons>
      </div>
      <div
        class="icon-container"
        :title="powerLang['sideBar.outline']"
        :class="activeTab === 'menu' ? ['icon-container-active'] : []"
        @click="activeTab = 'menu'"
      >
        <PDFIcons :width="20" :height="20" type="menu"></PDFIcons>
      </div>
    </div>
    <PDFThumb
      v-show="activeTab === 'thumb'"
      ref="pdfThumbRef"
      :current-page="currentPage"
      :page-s="pageS"
      :is-page-s-down="isPageSDown"
      :sidebar-scroll-width="sidebarScrollWidth"
      @update:current-page="emits('update:currentPage', $event)"
    ></PDFThumb>
    <PDFOutline
      v-show="activeTab === 'menu'"
      :outlines="outlines"
      @go-page="emits('update:currentPage', $event)"
    ></PDFOutline>
  </div>
</template>
<script setup lang="ts">
  import type { PropType } from 'vue';
  import { computed, inject, nextTick, ref, watch } from 'vue';
  import PDFIcons from '@/components/PDFIcons.vue';
  import type { OutlineType, PDFThumbExpose, PageTypeInfo } from '@/type';
  import PDFThumb from '@/components/PDFThumb.vue';
  import PDFOutline from '@/components/PDFOutline.vue';

  const props = defineProps({
    pageS: Object as PropType<Record<number, PageTypeInfo>>,
    isPageSDown: Boolean,
    currentPage: { type: Number, default: 1 },
    outlines: Array as PropType<OutlineType[]>,
  });
  const emits = defineEmits(['update:currentPage']);
  const sidebarScrollWidth = ref(8);
  const sidebarScrollWidthComp = computed(() => `${sidebarScrollWidth.value}px`);
  const pdfThumbRef = ref<PDFThumbExpose>();
  const powerLang = inject('powerLang');

  const activeTab = ref('thumb');
  watch(activeTab, (value, oldValue) => {
    if (value === 'thumb') {
      nextTick(() => {
        pdfThumbRef.value.setScrollTopByPage(props.currentPage);
      });
    }
  });
</script>

<style scoped lang="less">
  @import '../style/sidebar';
  .side-bar-container {
    --sidebar-scroll-width: v-bind(sidebarScrollWidthComp);
  }
</style>
