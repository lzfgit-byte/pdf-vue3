import type { Ref } from 'vue';
import type { PDFExpose, PDFMethods, PDFOpts, PDFProp } from '@/type';

export default (elRef: Ref<PDFExpose>, props: PDFProp, opts: PDFOpts): PDFMethods => {
  return {
    setCurrentPage: (currPage) => elRef.value.setCurrentPage(currPage),
    getCurrentPage: () => elRef.value.getCurrentPage(),
    getTotal: () => elRef.value.getTotal(),
    setScale: (scale) => elRef.value.setScale(scale),
  };
};
