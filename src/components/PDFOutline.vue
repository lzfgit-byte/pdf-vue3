<template>
  <div class="side-bar-bottom">
    <OutLineItem :outlines="outlines" @go-page="emits('goPage', $event)"></OutLineItem>
  </div>
</template>
<script setup lang="ts">
  import type { PropType } from 'vue';
  import OutLineItem from '@/components/OutLineItem.vue';
  import type { OutlineType } from '@/type';
  defineProps({ outlines: Array as PropType<OutlineType[]> });
  const emits = defineEmits(['goPage']);
</script>

<style scoped lang="less">
  @import '../style/values';
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
  }
</style>
