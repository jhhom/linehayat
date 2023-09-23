import { ParentComponent, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

type FeedbackId = {
  feedbackId: string | null;
};

export const makeFeedbackIdContext = () => {
  const [feedbackId, setFeedbackId] = createStore<FeedbackId>({
    feedbackId: null,
  });

  return {
    feedbackId,
    setFeedbackId,
  };
};

export const FeedbackIdContext =
  createContext<ReturnType<typeof makeFeedbackIdContext>>();

export const FeedbackIdProvider: ParentComponent = (props) => {
  const FeedbackId = makeFeedbackIdContext();

  return (
    <FeedbackIdContext.Provider value={FeedbackId}>
      {props.children}
    </FeedbackIdContext.Provider>
  );
};

export const useFeedbackId = () => {
  const c = useContext(FeedbackIdContext);
  if (c === undefined) {
    throw new Error(`FeedbackId Context is undefined`);
  }

  return c;
};
