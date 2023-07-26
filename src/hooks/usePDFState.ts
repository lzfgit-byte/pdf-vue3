import { computed, ref } from 'vue';
import type { PDFProp } from '@/type';

export default (props: PDFProp) => {
  const gap = computed(() => `${props.gap}px`);
  const isExpandAside = ref(true);
  return { gap, isExpandAside };
};
