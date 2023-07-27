import type { PDFPageProxy } from 'pdfjs-dist';
import { GlobalWorkerOptions, PixelsPerInch, getDocument } from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import PdfWorker from 'pdfjs-dist/build/pdf.worker?url';
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import type { Ref } from 'vue';
import { nextTick, onMounted, ref, shallowReactive, shallowRef } from 'vue';
import type { OutlineType, PDFProp, PDFViewerEmitsType, PageType } from '@/type';
import usePDFScroll, { renderPageByPage } from '@/hooks/usePDFScroll';
import usePDFZoom, { setZoomMapOpt } from '@/hooks/usePDFZoom';

GlobalWorkerOptions.workerSrc = PdfWorker;

export default (props: PDFProp, emits: PDFViewerEmitsType) => {
  const totalPage = ref(1);
  const currentPage = ref(1);
  const contains = ref<Ref<HTMLDivElement[]>[]>([]);
  const _scale = ref(1);
  const scrollRef = ref();
  const pageS: PageType = shallowReactive({});
  const outlines = ref<OutlineType[]>([]);
  // pageS 是否渲染完成
  const isPageSDown = ref(false);
  const progress = ref(0);
  let document = shallowRef<PDFDocumentProxy>();
  let stopScroll: Function;
  const render = async () => {
    let bottomHeight = 0;
    let widthScale = 0;
    let heightScale = 0;
    for (let i = 0; i < totalPage.value; i++) {
      // The page number to get. The first page is 1.
      const page: PDFPageProxy = await document.value.getPage(i + 1);
      if (!(contains.value[i]?.value?.length && contains.value[i].value.length > 0)) {
        return;
      }
      const currentDiv: HTMLDivElement = contains.value[i].value[0];
      const viewport = page.getViewport({ scale: _scale.value });

      const height = viewport.height * PixelsPerInch.PDF_TO_CSS_UNITS;

      const viewportOne = page.getViewport({ scale: 1 });
      const widthSet = viewportOne.width * PixelsPerInch.PDF_TO_CSS_UNITS;
      const heightSet = viewportOne.height * PixelsPerInch.PDF_TO_CSS_UNITS;
      widthScale =
        widthScale !== 0
          ? Math.min(scrollRef.value.clientWidth / widthSet, widthScale)
          : scrollRef.value.clientWidth / widthSet;
      heightScale =
        heightScale !== 0
          ? Math.min(scrollRef.value.clientHeight / heightSet, heightScale)
          : scrollRef.value.clientHeight / heightSet;
      bottomHeight += height + props.gap;
      currentDiv.style.height = `${height}px`;
      pageS[i + 1] = {
        page,
        bottomHeight,
        topHeight: bottomHeight - height,
        currentDiv,
        viewport,
        _scale: _scale.value,
      };
    }
    isPageSDown.value = true;
    emits('loaded');
    const { stop } = usePDFScroll(scrollRef, pageS, currentPage, emits, props);
    stopScroll = stop;

    setZoomMapOpt(heightScale, widthScale - 0.011);
  };

  const loadDoc = async () => {
    const loadingTask: PDFDocumentLoadingTask = getDocument(props.src);
    loadingTask.onProgress = (progressData: any) => {
      const { loaded, total } = progressData;
      progress.value = loaded / total;
      emits('progress', progressData);
    };
    document.value = await loadingTask.promise;
    totalPage.value = document.value.numPages;
    outlines.value = (await document.value.getOutline()) as any;

    contains.value = [];
    for (let i = 0; i < totalPage.value; i++) {
      contains.value.push(ref());
    }
    nextTick(() => {
      render();
    });
  };

  onMounted(() => {
    loadDoc().then();
  });

  const setCurrentPage = (currentPage: number) => {
    const page = pageS[currentPage];
    renderPageByPage(page, currentPage);
    scrollRef.value.scrollTop = page.topHeight + 10;
  };
  const setScale = async (scale: number) => {
    stopScroll && stopScroll();
    _scale.value = scale;
    await render();
    setCurrentPage(currentPage.value);
  };
  usePDFZoom(setScale);
  return {
    totalPage,
    currentPage,
    progress,
    contains,
    scrollRef,
    setCurrentPage,
    setScale,
    pageS,
    isPageSDown,
    outlines,
    document,
  };
};
