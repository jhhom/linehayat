import type { MessageInput } from "@api-contract/endpoints";
import { useMediaRecorder } from "~/pages/Chat.page/components/Chat/VoiceTextInput/useMediaRecorder";
import { createEffect, createSignal, Show } from "solid-js";
import { formatDuration, intervalToDuration } from "date-fns";
import { match, P } from "ts-pattern";
import { useIsTyping } from "~/pages/Chat.page/components/Chat/use-is-typing.hook";

export default function VoiceTextInput(props: {
  onSubmit: (m: MessageInput) => void;
  onTyping: (isTyping: boolean) => void;
}) {
  const [inputMode, setInputMode] = createSignal<"text" | "voice">("text");
  const {
    status,
    startRecording,
    stopRecording,
    pauseRecording,
    mediaBlobUrl,
  } = useMediaRecorder({ audio: true });
  const { register, isTyping } = useIsTyping({ timeout: 1500 });

  const [textInput, setTextInput] = createSignal("");
  const [recordingTime, setRecordingTime] = createSignal(0);
  const [recordingTimer, setRecordingTimer] =
    createSignal<ReturnType<typeof setInterval>>();

  createEffect(() => {
    if (status() === "recording") {
      const interval = setInterval(() => {
        setRecordingTime((time) => time + 1);
      }, 1000);
      setRecordingTimer(interval);
    } else if (status() === "paused") {
      clearInterval(recordingTimer());
      setRecordingTimer(undefined);
    } else if (status() === "stopped" || status() === "idle") {
      clearInterval(recordingTimer());
      setRecordingTimer(undefined);
      setRecordingTime(0);
    }
  });

  createEffect(async () => {
    props.onTyping(isTyping());
  });

  const submitMessage = async () => {
    if (inputMode() === "text") {
      if (textInput() !== "") {
        props.onSubmit({
          type: "text",
          content: textInput(),
        });
        setTextInput("");
      }
    } else {
      stopRecording();
      setInputMode("text");
      // for some reason, if we don't do this in a setTimeout of at least 50ms
      // then `mediaBlobUrl()` will be `undefined`
      setTimeout(async () => {
        const audioUrl = mediaBlobUrl();
        if (audioUrl) {
          await fetch(audioUrl)
            .then((response) => response.blob())
            .then((b) => {
              const reader = new FileReader();

              reader.onload = function () {
                if (reader.result) {
                  const data = reader.result.toString();
                  props.onSubmit({
                    type: "voice",
                    blobBase64: data,
                  });
                }
              };
              reader.readAsDataURL(b);
            });
        }
      }, 100);
    }
  };

  return (
    <div class="flex items-center justify-center">
      <div class="flex w-full border bg-gray-100 px-2 py-2">
        <Show when={inputMode() !== "text"}>
          <div>
            <button
              onClick={() => {
                stopRecording();
                setInputMode("text");
                setTextInput("");
              }}
              class="flex h-10 w-10 items-center justify-center p-3 text-gray-600"
            >
              <IconThrash />
            </button>
          </div>
        </Show>
        <div class="flex-1 flex-grow">
          {match([inputMode(), status()])
            .with(["text", P._], () => (
              <>
                <input
                  ref={(r) => {
                    register(r);
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      await submitMessage();
                    }
                  }}
                  value={textInput()}
                  onInput={(e) => setTextInput(e.target.value)}
                  class="w-full rounded-md bg-white px-4 py-2"
                  type="text"
                  placeholder="Type a message"
                />
              </>
            ))
            .with(["voice", "recording"], () => (
              <div class="flex h-full items-center">
                <p>{formatRecordingTime(recordingTime())}</p>
                <div class="animate-blink flex h-full items-center pl-4">
                  <div class="h-3 w-3 rounded-full bg-red-500" />
                  <p class="pl-2">Recording</p>
                </div>
              </div>
            ))
            .otherwise(() => (
              <div class="flex h-full items-center">
                <p>{formatRecordingTime(recordingTime())}</p>
                <div class="flex h-full items-center pl-4">
                  <div class="h-3 w-3 rounded-full bg-red-500" />
                  <p class="pl-2">Voice Recorder</p>
                </div>
              </div>
            ))}
        </div>

        <div class="flex">
          <Show
            when={
              // when user type something, it will switch to MIC, which is wrong
              // when user type something, icon still set as SEND
              // when in the middle of recording,
              status() === "recording" ||
              (textInput() !== "" && inputMode() === "text")
            }
            fallback={
              <button
                onClick={() => {
                  setInputMode("voice");
                  startRecording();
                }}
                class="flex h-10 w-10 items-center justify-center p-2 text-gray-600"
                classList={{
                  "text-gray-600": inputMode() === "text",
                  "text-red-500": inputMode() !== "text",
                }}
              >
                <IconMicrophone />
              </button>
            }
          >
            <button
              onClick={submitMessage}
              class="flex h-10 w-10 items-center justify-center rounded-full py-1 pl-2"
            >
              <div class="flex h-full w-full items-center justify-center rounded-full bg-green-600 p-1.5 text-white">
                <IconSend />
              </div>
            </button>
          </Show>
        </div>
      </div>
    </div>
  );
}

const formatRecordingTime = (seconds: number) => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  // { minutes: 30, seconds: 7 }

  const zeroPad = (num: number) => String(num).padStart(2, "0");

  if (seconds >= 3600) {
    const formatted = formatDuration(duration, {
      format: ["hours", "minutes", "seconds"],
      // format: ["hours", "minutes", "seconds"],
      zero: true,
      delimiter: ":",
      locale: {
        formatDistance: (_token, count) => zeroPad(count),
      },
    });
    return formatted;
  } else {
    const formatted = formatDuration(duration, {
      format: ["minutes", "seconds"],
      // format: ["hours", "minutes", "seconds"],
      zero: true,
      delimiter: ":",
      locale: {
        formatDistance: (_token, count) => zeroPad(count),
      },
    });
    return formatted;
  }
};

function IconMicrophone(props: { class?: string }) {
  return (
    <svg
      class={props.class}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
    >
      <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm-40 280v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Z" />
    </svg>
  );
}

function IconPauseCircle() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 -960 960 960"
    >
      <path d="M360-320h80v-320h-80v320Zm160 0h80v-320h-80v320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill="currentColor"
    >
      <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" />
    </svg>
  );
}

function IconThrash() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      fill="currentColor"
    >
      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill="currentColor"
    >
      <path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z" />
    </svg>
  );
}
