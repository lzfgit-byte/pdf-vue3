let renderBoolFilter;
export const mark = (index, flag = true) => {
  renderBoolFilter[index] = flag;
};
export const getMark = (index) => renderBoolFilter[index];
export default (totalPages) => {
  renderBoolFilter = Array.from({ length: totalPages }).fill(false);
  return {
    renderBoolFilter,
    mark,
    getMark,
  };
};
