import { EventBus, PDFPageView } from 'pdfjs-dist/web/pdf_viewer';
import type { PageType, PageTypeInfo } from '@/type';
import { getMark, mark } from '@/hooks/usePDFRenderBoolFilter';

export default (pageViewers: PageType, totalPages: number) => {
  if (totalPages >= 4) {
    for (let key = 1; key <= 4; key++) {
      const { page, currentDiv, viewport, _scale }: PageTypeInfo = pageViewers[key];
      if (getMark(+key - 1)) {
        return;
      }
      mark(+key - 1, true);
      const bus = new EventBus();
      const pageViewer: PDFPageView = new PDFPageView({
        container: currentDiv,
        eventBus: bus,
        id: new Date().getTime(),
        defaultViewport: viewport,
        scale: _scale,
      });
      pageViewer.setPdfPage(page);
      pageViewer.draw().then(() => {
        console.log(`渲染第${key}页`);
      });
    }
  }
};
