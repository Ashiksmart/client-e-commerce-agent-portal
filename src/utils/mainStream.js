function getANBBoolean(...conditions) {
  return conditions.every(Boolean);
}

function convertToNumber(amount = "") {
  const removeSpecialCharacters = amount.replace("₹", "");
  const numericValue = parseFloat(removeSpecialCharacters);
  return !Number.isNaN(numericValue) ? parseInt(numericValue) : 0;
}
function handleAmount(...rest) {
  const amount = [...rest].filter((data) => data).toString() || 0;
  let value = false;
  if (typeof amount === "string" && amount) {
    value = this.convertToNumber(amount);
  } else if (typeof amount === "number" && amount) {
    value = amount;
  }
  return !Number.isNaN(value) ? parseInt(value) : 0;
}
function _sum(array = [], field = '') {
  return array?.reduce((init, item) => {
    return init + Number(item[field]);
  }, 0);
}

export { _sum, getANBBoolean, convertToNumber, handleAmount };
