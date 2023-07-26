<template>
  <div v-if="progress !== 1" class="progress-bar-container">
    <div class="progress-total"></div>
    <div class="progress-progress"></div>
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps({ progress: Number });
  const barProgress = computed(() => `${props.progress * 100}%`);
</script>

<style scoped lang="less">
  @import '../style/values';
  .progress-bar-container {
    position: absolute;
    width: 100%;
    height: @progress-bg-height;
    .progress-total {
      width: 100%;
      height: 100%;
      position: absolute;
    }
    .progress-progress {
      height: 100%;
      width: v-bind(barProgress);
      background-color: @progress-bg-color;
      position: absolute;
      z-index: 3;
    }
  }
</style>
