export const useDebounce = (fn: (...props: any) => void, delay: number) => {
  let timeout: any;

  const debounce = (...props: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(props);
    }, delay);
  };

  return debounce;
};
