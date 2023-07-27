import { EventBus, PDFPageView } from 'pdfjs-dist/web/pdf_viewer';
import type { PageType, PageTypeInfo } from '@/type';
import { getMark, mark } from '@/hooks/usePDFRenderBoolFilter';
import { doRenderPage } from '@/hooks/usePDFScroll';

export default (pageViewers: PageType, totalPages: number) => {
  if (totalPages >= 4) {
    for (let key = 1; key <= 4; key++) {
      const { page, currentDiv, viewport, _scale }: PageTypeInfo = pageViewers[key];
      if (getMark(+key - 1)) {
        return;
      }
      mark(+key - 1, true);
      doRenderPage(currentDiv, viewport, _scale, page, key);
    }
  }
};
