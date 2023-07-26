<template>
  <div style="width: 100%; height: 98vh">
    <PDFViewer ref="viewRef" v-bind="props"></PDFViewer>
  </div>
</template>

<script setup lang="ts">
  import usePDFViewer from '@/hooks/usePDFViewer';
  import PDFViewer from '@/PDFViewer.vue';

  const [viewRef, props, methods] = usePDFViewer({
    src: 'http://192.168.0.220:7000/power-file/download/1683316289011527682?type=byteStream&access_token=1084540c-b5ef-4a89-806e-e1f1ebe97ce9',
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
