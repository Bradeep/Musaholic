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
