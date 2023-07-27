import { computed, ref, watch } from 'vue';

const zoomMapOpt = {
  height: '',
  width: '',
};
export const setZoomMapOpt = (height, width) => {
  zoomMapOpt.height = height;
  zoomMapOpt.width = width;
};
export const zoomOpts = ref([
  { value: '1.2', label: '自动缩放' },
  { value: '1', label: '实际大小' },
  { value: 'height', label: '适应页面' },
  { value: 'width', label: '适合页宽' },
  { value: '0.5', label: '50%' },
  { value: '0.75', label: '75%' },
  { value: '1', label: '100%' },
  { value: '1.25', label: '125%' },
  { value: '1.5', label: '150%' },
  { value: '2', label: '200%' },
  { value: '3', label: '300%' },
  { value: '4', label: '400%' },
]);

export const zoomValue = ref(1);
export const handlerZoomChange = (evt: Event) => {
  const elm: HTMLOptionElement = evt.target as any;
  console.log(elm.value);
};
export const currentScale = ref(1);
// 放大
export const increaseZoom = () => {
  zoomValue.value = currentScale.value + 0.1;
};
// 缩小
export const decreaseZoom = () => {
  zoomValue.value = currentScale.value - 0.1;
};
export const translateZoomValue = computed(() => {
  const hitArr = zoomOpts.value.filter((item) => item.value === `${zoomValue.value}`);
  if (hitArr.length > 0) {
    return hitArr[0].label;
  }
  return `${(zoomValue.value * 100).toFixed(0)}%`;
});
export default (setScale: (scale: number) => void) => {
  watch(zoomValue, () => {
    const scale = zoomMapOpt[zoomValue.value] || zoomValue.value;
    currentScale.value = +scale;
    setScale(+scale);
  });
  return {};
};
