import { ParentComponent, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

type Messages = {
  messages: {
    content: string;
    userIsAuthor: boolean;
  }[];
};

export const makeMessagesContext = () => {
  const [messages, setMessages] = createStore<Messages>({
    messages: [],
  });

  return {
    messages,
    setMessages,
  };
};

export const MessagesContext =
  createContext<ReturnType<typeof makeMessagesContext>>();

export const MessagesProvider: ParentComponent = (props) => {
  const messages = makeMessagesContext();

  return (
    <MessagesContext.Provider value={messages}>
      {props.children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const m = useContext(MessagesContext);
  if (m === undefined) {
    throw new Error(`Messages Context is undefined`);
  }

  return m;
};
