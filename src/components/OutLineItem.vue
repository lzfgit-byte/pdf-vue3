<template>
  <div v-for="(item, index) in outlines" :key="index" class="item-container">
    <div class="item-outline-icons" @click="handlerIconClick(index)">
      <PDFIcons
        v-if="item.items.length > 0 && !isExpandArr[index]"
        type="arrowRight"
        :width="18"
        :height="18"
      ></PDFIcons>
      <PDFIcons
        v-else-if="item.items.length > 0 && isExpandArr[index]"
        type="arrowDown"
        :width="18"
        :height="18"
      ></PDFIcons>
      <div v-else style="width: 18px; height: 18px" @click.stop.prevent="() => 1"></div>
    </div>
    <div class="item-title">
      <span @click="handlerTitleClick(item)">{{ item.title }}</span>
      <div :class="isExpandArr[index] ? [] : ['unExpand']">
        <out-line-item :outlines="item.items" @go-page="emits('goPage', $event)"></out-line-item>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import type { PropType, Ref } from 'vue';
  import { inject, ref } from 'vue';
  import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
  import PDFIcons from '@/components/PDFIcons.vue';
  import type { OutlineType } from '@/type';
  const props = defineProps({ outlines: Array as PropType<OutlineType[]> });
  const emits = defineEmits(['goPage']);
  const isExpandArr = ref(Array.from({ length: props?.outlines?.length }).fill(false));
  const handlerIconClick = (index) => {
    isExpandArr.value[index] = !isExpandArr.value[index];
  };
  const document: Ref<PDFDocumentProxy> = inject('document');
  const handlerTitleClick = async (item: OutlineType) => {
    if (item?.dest?.length > 0) {
      const index = await document.value.getPageIndex(item.dest[0]);
      emits('goPage', index + 1);
    }
  };
</script>

<style scoped lang="less">
  @import '../style/values';
  .item-container {
    display: flex;
    box-sizing: border-box;
    padding: 2px 0;
    .item-outline-icons {
      cursor: pointer;
    }
    .unExpand {
      display: none;
    }
    .item-title {
      font-size: 14px;
      span {
        cursor: pointer;
        &:hover {
          background-color: @icon-active-color;
        }
      }
    }
  }
</style>
