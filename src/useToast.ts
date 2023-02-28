import { ref } from "vue";

interface IToast {
  class: string;
  delay: number;
  show: boolean;
  message: string;
  toastId: number;
};

const toasts = ref<IToast[]>([]);

const toastId = (function*() {
  let key = 0;
  while (true) {
    yield ++key;
    if (key >= 100) key = 0;
  };
})();

export const useToast = () => {
  const getToastIndexById = (id: number) =>
    toasts.value.findIndex(toast => toast.toastId === id);

  const pushToast = (toastInfo: Omit<IToast, "toastId" | "show">) => {
    const generatedId = toastId.next().value;

    toasts.value.push({ ...toastInfo, toastId: generatedId, show: true, });

    /**
     * Initializes the animation after the delay
     */
    setTimeout(() => {
      const toastIndex = getToastIndexById(generatedId);
      toasts.value[toastIndex].show = false;

      /**
       * Removes the toast after the animation
       */
      setTimeout(() => {
        const toastIndex = getToastIndexById(generatedId);
        toasts.value.splice(toastIndex, 1);
      }, 1000);
    }, toastInfo.delay);
  };

  return {
    toasts,
    pushToast,
  };
};
