<template>
  <div ref="thumbContainerRef" class="side-bar-bottom">
    <div
      v-for="(item, index) in divRef"
      :key="index"
      :ref="divRef[index]"
      class="side-bar-thumb-container"
      :class="currentPage === index + 1 && images[index] ? ['current-page-side-bar'] : []"
      @click="handlerSetCurrentPage(index + 1)"
    >
      <div
        class="current-img-container"
        :class="currentPage === index + 1 && images[index] ? ['current-page'] : []"
      >
        <img :src="images[index]" alt="" />
      </div>
      <div class="page-index">
        <span>{{ index + 1 }} {{ images[index] === '' ? '加载中' : '' }} </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import type { PropType } from 'vue';
  import { computed, nextTick, onMounted, ref, watch } from 'vue';
  import { debounce, keys } from 'lodash';
  import type { PageTypeInfo } from '@/type';

  const props = defineProps({
    pageS: Object as PropType<Record<number, PageTypeInfo>>,
    isPageSDown: Boolean,
    currentPage: { type: Number, default: 1 },
    sidebarScrollWidth: Number,
  });
  const emits = defineEmits(['update:currentPage']);
  const keysC = computed(() => keys(props.pageS).length);
  const handlerSetCurrentPage = (currentPage) => {
    emits('update:currentPage', currentPage);
  };
  interface DivSType {
    [key: number]: {
      bottomHeight: number;
      topHeight: number;
      elDiv: HTMLDivElement;
      curPage: PageTypeInfo;
    };
  }
  const thumbContainerRef = ref<HTMLDivElement>();
  const divRef = ref([]);
  const images = ref([]);
  // 缩略图div的信息,key 为页数
  const divS: DivSType = {};
  const thumbBoolFilter = {};
  const renderThumb = (curPage, i) => {
    if (thumbBoolFilter[i]) {
      return;
    }
    thumbBoolFilter[i] = true;
    const { page, _scale }: PageTypeInfo = curPage;
    const scaledViewport = page.getViewport({ scale: _scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;
    page
      .render({
        canvasContext: context,
        viewport: scaledViewport,
      })
      .promise.then(() => {
        images.value[i] = canvas.toDataURL('image/png', 0.1);
        console.log(`渲染第${i + 1}个缩略图`);
      });
  };
  // 渲染当前页数附近的缩略图
  const renderThumbNearby = (i, totalPages) => {
    if (i - 5 >= 0) {
      for (let j = 1; j <= 5; j++) {
        const cKey = i - j + 1;
        const curDiv = divS[cKey];
        const { curPage } = curDiv;
        renderThumb(curPage, cKey - 1);
      }
    }
    if (i + 5 <= totalPages) {
      for (let j = 1; j <= 5; j++) {
        const { curPage } = divS[i + j];
        renderThumb(curPage, i + j - 1);
      }
    }
    if (i + 5 > totalPages) {
      for (let j = 1; +i + j <= totalPages; j++) {
        const { curPage } = divS[i + j];
        renderThumb(curPage, i + j - 1);
      }
    }
  };
  // 存储将用来渲染div的基本信息
  const setDivHeight = () => {
    let totalHeight = 0;
    for (let i = 0; i < keysC.value; i++) {
      const curPage = props?.pageS[i + 1];
      const elDiv: HTMLDivElement = divRef.value[i].value[0];
      const parentDiv: HTMLDivElement = thumbContainerRef.value;
      const { scrollHeight, clientHeight } = parentDiv;
      const scrollWidth = scrollHeight === clientHeight ? props.sidebarScrollWidth : 0;
      const { page, _scale }: PageTypeInfo = curPage;
      //
      const scaledViewport = page.getViewport({ scale: _scale });
      const clientWidth = elDiv.clientWidth - scrollWidth;
      //

      const viewHeight = scaledViewport.height * (clientWidth / scaledViewport.width);
      totalHeight += viewHeight;
      elDiv.style.height = `${viewHeight}px`;
      divS[i + 1] = {
        bottomHeight: totalHeight,
        topHeight: totalHeight - viewHeight,
        elDiv,
        curPage,
      };
    }
    nextTick(() => {
      renderThumbNearby(0, keysC.value);
    });
  };
  const createDiv = () => {
    divRef.value = [];
    images.value = [];
    for (let i = 0; i < keysC.value; i++) {
      divRef.value.push(ref());
      images.value.push('');
    }
    nextTick(() => {
      setDivHeight();
    });
  };

  const handlerScroll = debounce(() => {
    const scrollTop = thumbContainerRef.value.scrollTop;
    const divsKey = keys(divS);
    for (let i = 0; i < divsKey.length; i++) {
      const curDiv = divS[i + 1];
      const { bottomHeight, topHeight, curPage } = curDiv;
      if (scrollTop >= topHeight && scrollTop < bottomHeight) {
        renderThumb(curPage, i);
        renderThumbNearby(i, divsKey.length);
        break;
      }
    }
  }, 100);
  onMounted(() => {
    thumbContainerRef.value.addEventListener('scroll', handlerScroll);
  });

  watch(
    () => props.isPageSDown,
    (value) => {
      if (value) {
        createDiv();
      }
    }
  );
  const setScrollTopByPage = (currentPage) => {
    const { curPage, topHeight, bottomHeight } = divS[currentPage];
    renderThumb(curPage, currentPage - 1);
    renderThumbNearby(currentPage - 1, keys(divS).length);
    nextTick(() => {
      thumbContainerRef.value.scrollTop = topHeight - (bottomHeight - topHeight);
    });
  };
  watch(
    () => props.currentPage,
    (value) => {
      setScrollTopByPage(value);
    }
  );
  defineExpose({ setScrollTopByPage });
</script>

<style scoped lang="less">
  @import '../style/values';
  div {
    box-sizing: border-box;
  }
  .current-page {
    img {
      box-sizing: border-box;
      border: 8px solid rgb(138, 180, 248);
    }
  }
  .side-bar-bottom {
    width: 100%;
    height: 100% - @side-bar-top-height;
    overflow: auto;
    border-right: 1px solid @main-bg-color-lighting;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: var(--sidebar-scroll-width); /*高宽分别对应横竖滚动条的尺寸*/
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      -webkit-box-shadow: inset005pxrgba(0, 0, 0, 0.2);
      background: #c1c1c1;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      -webkit-box-shadow: inset005pxrgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: #f1f1f1;
    }
    .side-bar-thumb-container {
      width: 100%;
      height: auto;
      cursor: pointer;

      .current-img-container {
        width: 100%;
        display: flex;
        justify-content: center;
        position: relative;
        img {
          width: 80%;
        }
        .image-icon-container {
          width: 100%;
          height: 100%;
          display: flex;
          box-sizing: border-box;
          justify-content: center;
          align-items: center;
          position: absolute;
          animation: rotateAnimate 0.6s infinite;
        }
      }
      .page-index {
        margin-top: 5px;
        display: flex;
        justify-content: center;
      }
    }
  }
</style>
