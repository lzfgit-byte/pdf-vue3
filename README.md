# pdf-vue3

![Image text](https://raw.githubusercontent.com/lzfgit-byte/pdf-vue3/main/public/img_2.png)
```vue
<template>
  <div style="width: 100%; height: 98vh">
    <PDFViewer ref="viewRef" v-bind="props"></PDFViewer>
  </div>
</template>

<script setup lang="ts">
  import usePDFViewer from '@/hooks/usePDFViewer';
  import PDFViewer from '@/PDFViewer.vue';

  const [viewRef, props, methods] = usePDFViewer({
    src: '',
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

```
