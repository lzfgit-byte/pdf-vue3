import type { PDFPageProxy } from 'pdfjs-dist';
import type { PageViewport } from 'pdfjs-dist/types/src/display/display_utils';
import type { DocumentInitParameters, TypedArray } from 'pdfjs-dist/types/src/display/api';
import type { PDFViewerEmits } from '@/const/emits';

export type PDFViewerEmitsType = (emit: (typeof PDFViewerEmits)[number], ...args: any[]) => void;

export interface PageTypeInfo {
  page: PDFPageProxy;
  topHeight: number;
  bottomHeight: number;
  currentDiv: HTMLDivElement;
  viewport: PageViewport;
  _scale: number;
}
export type PageType = Record<number, PageTypeInfo>;
export type PDFIconType = 'thumb' | 'menu' | 'sidebar' | 'loading' | 'arrowRight' | 'arrowDown';

export interface PDFProp {
  src: string | URL | TypedArray | ArrayBuffer | DocumentInitParameters;
  gap?: number;
  lang?: Record<string, any>;
  onLoaded?: () => void;
  onEnded?: () => void;
  onProgress?: (progress: number) => void;
  onScroll?: () => void;
}
export interface PDFOpts extends PDFProp {}
export interface PDFExpose {
  setCurrentPage: (page: number) => void;
  getCurrentPage: () => number;
  getTotal: () => number;
}
export interface PDFMethods {
  setCurrentPage: (page: number) => void;
  getCurrentPage: () => number;
  getTotal: () => number;
}
export interface OutlineType {
  dest: [{ num: number; gen: number }, { name: string }];
  items: OutlineType[];
  title: string;
}

export interface PDFThumbExpose {
  setScrollTopByPage?: (currentPage: number) => void;
}