export const throttle = (func, delay) => {
  let flag = true;
  return function () {
    let args = arguments;
    if (flag) {
      func.apply(this, args);
      flag = false;
      setTimeout(() => {
        flag = true;
      }, delay);
    }
  };
};

export const debounce = (func, delay) => {
  let timer;
  return function () {
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      func.apply(this, args);
    }, delay);
  };
};

export const getFormattedDate = (date) => {
  const tdate = date;
  const offset = tdate.getTimezoneOffset();
  const offsetDate = new Date(tdate.getTime() - offset * 60 * 1000);
  const formatDate = offsetDate.toISOString().split("T")[0];

  return formatDate;
};

export const isNil = (data) => data == null;

export const isObjectAndHasData = (value) =>
  !isNil(value) && typeof value === "object" && Object.keys(value).length > 0;

export const isArrayAndHasData = (value) =>
  !isNil(value) && Array.isArray(value) && value.length > 0;
