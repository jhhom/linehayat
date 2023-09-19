import { onMount } from "solid-js";
import { createSignal, Show } from "solid-js";

export default function AudioPlayer(props: { audioSrc: string }) {
  const [isPlaying, setIsPlaying] = createSignal(false);

  let playButton!: HTMLButtonElement;
  let audioPlayerContainer!: HTMLDivElement;
  let seekSlider!: HTMLInputElement;
  let audio!: HTMLAudioElement;
  let durationContainer!: HTMLDivElement;
  let currentTimeContainer!: HTMLSpanElement;
  let raf: any;

  onMount(async () => {
    if (audio.readyState > 0) {
      displayDuration();
      setSliderMax();
      displayBufferedAmount();
    } else {
      audio.addEventListener("loadedmetadata", async () => {
        displayDuration();
        setSliderMax();
        displayBufferedAmount();
      });
    }
  });

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  };

  const displayDuration = () => {
    durationContainer.textContent = calculateTime(audio.duration);
  };

  const setSliderMax = () => {
    seekSlider.max = Math.floor(audio.duration).toString();
  };

  const displayBufferedAmount = () => {
    const bufferedAmount = Math.floor(
      audio.buffered.end(audio.buffered.length - 1),
    );
    audioPlayerContainer.style.setProperty(
      "--buffered-width",
      `${(bufferedAmount / +seekSlider.max) * 100}%`,
    );
  };

  const whilePlaying = () => {
    seekSlider.value = Math.floor(audio.currentTime).toString();

    currentTimeContainer.textContent = calculateTime(+seekSlider.value);

    audioPlayerContainer.style.setProperty(
      "--seek-before-width",
      `${(+seekSlider.value / +seekSlider.max) * 100}%`,
    );
    raf = requestAnimationFrame(whilePlaying);
  };

  const showRangeProgress = (rangeInput: any) => {
    if (rangeInput === seekSlider) {
      audioPlayerContainer.style.setProperty(
        "--seek-before-width",
        (rangeInput.value / rangeInput.max) * 100 + "%",
      );
    } else {
      audioPlayerContainer.style.setProperty(
        "--volume-before-width",
        (rangeInput.value / rangeInput.max) * 100 + "%",
      );
    }
  };

  return (
    <div ref={audioPlayerContainer} class="flex items-center">
      <audio
        ref={audio}
        src={props.audioSrc}
        preload="metadata"
        loop
        onProgress={() => {
          displayBufferedAmount();
        }}
      ></audio>

      <button
        ref={playButton}
        onClick={() => {
          if (audio === null) {
            return;
          }
          if (isPlaying()) {
            audio.play();
            requestAnimationFrame(whilePlaying);
            setIsPlaying(false);
          } else {
            audio.pause();
            cancelAnimationFrame(raf);
            setIsPlaying(true);
          }
        }}
        class="flex h-12 w-12 items-center justify-center p-3 text-gray-400"
      >
        <Show
          when={!isPlaying()}
          fallback={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 -960 960 960"
            >
              <path d="M320-200v-560l440 280-440 280Z" />
            </svg>
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 -960 960 960"
          >
            <path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z" />
          </svg>
        </Show>
      </button>

      <span
        ref={currentTimeContainer}
        class="flex items-center text-sm text-gray-500"
      >
        0:00
      </span>

      <input
        ref={seekSlider}
        class="audio-progress-2"
        type="range"
        max="100"
        value="0"
        onInput={(e) => {
          currentTimeContainer.textContent = calculateTime(+seekSlider.value);
          if (!audio.paused) {
            cancelAnimationFrame(raf);
          }
          showRangeProgress(e.target);
        }}
        onChange={() => {
          audio.currentTime = +seekSlider.value;
          if (!audio.paused) {
            requestAnimationFrame(whilePlaying);
          }
        }}
      />

      <span
        ref={durationContainer}
        class="flex items-center text-sm text-gray-500"
      >
        0:00
      </span>
    </div>
  );
}
