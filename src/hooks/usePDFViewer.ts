import type { Ref } from 'vue';
import { ref } from 'vue';
import type { PDFExpose, PDFMethods, PDFOpts, PDFProp } from '@/type';
import usePDFProps from '@/hooks/usePDFProps';
import usePDFMethods from '@/hooks/usePDFMethods';

export default (opts: PDFOpts): [Ref<PDFExpose>, PDFProp, PDFMethods] => {
  const elRef = ref<PDFExpose>();
  const props = usePDFProps(opts);
  const methods = usePDFMethods(elRef, props, opts);
  return [elRef, props, methods];
};
