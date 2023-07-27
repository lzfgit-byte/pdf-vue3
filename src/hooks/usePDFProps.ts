import { reactive } from 'vue';
import type { PDFOpts, PDFProp } from '@/type';
import { PDFView_ZH_CN } from '@/lang/zh-cn';

export default (opts: PDFOpts): PDFProp => {
  const { src, lang = PDFView_ZH_CN, findPage } = opts;
  const { onEnded, onScroll, onLoaded, onProgress } = opts;
  return reactive({ src, lang, findPage, onLoaded, onProgress, onScroll, onEnded }) as PDFProp;
};
