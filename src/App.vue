<template>
  <div style="width: 100%; height: 98vh">
    <PDFViewer ref="viewRef" v-bind="props"></PDFViewer>
  </div>
</template>

<script setup lang="ts">
  import usePDFViewer from '@/hooks/usePDFViewer';
  import PDFViewer from '@/PDFViewer.vue';

  const [viewRef, props, methods] = usePDFViewer({
    src: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    onLoaded: () => {
      console.log('loaded');
    },
    onScroll: () => {
      console.log('scroll');
    },
    onEnded: () => {
      console.log('ended');
    },
  });
</script>
