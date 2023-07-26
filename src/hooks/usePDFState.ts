import { computed, ref, watch } from 'vue';
import type { PDFProp } from '@/type';

export default (props: PDFProp) => {
  const gap = computed(() => `${props.gap}px`);
  const isExpandAside = ref(true);
  const isExpandAsideClass = ref(true);
  const asideWidth = computed(() => (isExpandAside.value ? '12%' : '0%'));
  const asideMinWidth = computed(() => (isExpandAside.value ? '150px' : '0px'));
  watch(isExpandAside, (value) => {
    if (value) {
      setTimeout(() => {
        isExpandAsideClass.value = value;
      }, 500);
    } else {
      isExpandAsideClass.value = value;
    }
  });
  return { gap, isExpandAside, asideWidth, asideMinWidth, isExpandAsideClass };
};
