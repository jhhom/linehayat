import { createSignal, onCleanup } from "solid-js";

// reference
// https://github.com/KATT/use-is-typing/blob/main/src/index.tsx

type UseIsTypingProps = {
  timeout: number;
};

export function useIsTyping(props: UseIsTypingProps) {
  let currentEl: HTMLInputElement;
  let timeoutRef: ReturnType<typeof setTimeout> | undefined;

  const [isTyping, setIsTyping] = createSignal(false);

  const register = (el: HTMLInputElement) => {
    currentEl = el;
    setIsTyping(false);

    if (!currentEl) {
      return;
    }

    const keyUpDownListener = (e: Event) => {
      const hasValue = (e.target as HTMLInputElement).value !== "";

      setIsTyping(hasValue);
      reset();
    };
    const blurListener = () => {
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }

      setIsTyping(false);
    };

    currentEl.addEventListener("keyup", keyUpDownListener);
    currentEl.addEventListener("keydown", keyUpDownListener);
    currentEl.addEventListener("blur", blurListener);

    onCleanup(() => {
      clearTimeout(timeoutRef);
      currentEl.removeEventListener("keydown", keyUpDownListener);
      currentEl.removeEventListener("keyup", keyUpDownListener);
      currentEl.removeEventListener("blur", blurListener);
    });
  };

  const reset = () => {
    // debounce reset() based on timeout
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }
    timeoutRef = setTimeout(() => {
      setIsTyping(false);
    }, props.timeout);
  };

  return {
    register,
    isTyping,
  };
}
