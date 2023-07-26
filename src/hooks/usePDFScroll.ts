import type { Ref } from 'vue';
import { debounce, keys } from 'lodash';
import { EventBus, PDFPageView } from 'pdfjs-dist/web/pdf_viewer';
import type { PDFViewerEmitsType, PageType, PageTypeInfo } from '@/type';
import usePDFRenderBoolFilter, { getMark, mark } from '@/hooks/usePDFRenderBoolFilter';
import usePDFStartRender from '@/hooks/usePDFStartRender';

export const renderPageByPage = (_page: PageTypeInfo, key) => {
  const { page, currentDiv, viewport, _scale }: PageTypeInfo = _page;
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
};

export default (
  divRef: Ref<HTMLDivElement>,
  pageViewers: PageType,
  currentPage: Ref<number>,
  emits: PDFViewerEmitsType
) => {
  const objKeys = keys(pageViewers);
  const totalPages = objKeys.length;
  const { mark, getMark } = usePDFRenderBoolFilter(totalPages);
  usePDFStartRender(pageViewers, totalPages);
  const renderPage = (currentDiv: HTMLDivElement, viewport, _scale, page, key) => {
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
  };
  const renderNearby = (key) => {
    if (key > 5) {
      for (let j = 1; j <= 5; j++) {
        const { page, currentDiv, viewport, _scale }: PageTypeInfo = pageViewers[+key - j];
        renderPage(currentDiv, viewport, _scale, page, +key - j);
      }
    }

    if (key + 5 <= totalPages) {
      for (let j = 1; j <= 5; j++) {
        const { page, currentDiv, viewport, _scale }: PageTypeInfo = pageViewers[+key + j];
        renderPage(currentDiv, viewport, _scale, page, +key + j);
      }
    }
    if (key + 5 > totalPages) {
      for (let j = 1; +key + j <= totalPages; j++) {
        const { page, currentDiv, viewport, _scale }: PageTypeInfo = pageViewers[+key + j];
        renderPage(currentDiv, viewport, _scale, page, +key + j);
      }
    }
  };

  const isScrollbarAtBottom = () => {
    const scrollHeightValue = divRef.value.scrollHeight; // 内部内容的总高度
    const clientHeightValue = divRef.value.clientHeight; // 外部 div 的高度
    const scrollTopValue = divRef.value.scrollTop; // 滚动的位置
    // 判断滚动条是否在底部
    return scrollHeightValue - scrollTopValue === clientHeightValue;
  };

  const scrollHandler = debounce((evt: Event) => {
    const divEl: HTMLDivElement = evt.target as any;

    const scrollTop = divEl.scrollTop;
    for (let i = 0; i < objKeys.length; i++) {
      const key = objKeys[i];
      const { page, bottomHeight, topHeight, currentDiv, viewport, _scale }: PageTypeInfo =
        pageViewers[key];
      const topOffset = 0;
      const midLine = scrollTop - topOffset;
      if (midLine < bottomHeight && midLine > topHeight) {
        renderPage(currentDiv, viewport, _scale, page, key);
        renderNearby(+key);
        currentPage.value = +key;
        emits('scroll');
        if (isScrollbarAtBottom()) {
          currentPage.value = totalPages;
          emits('ended');
        }
        break;
      }
    }
  }, 200);
  divRef.value.addEventListener('scroll', scrollHandler);
  return {};
};
