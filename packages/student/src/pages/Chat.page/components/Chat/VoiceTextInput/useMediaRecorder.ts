// reference: https://github.com/DeltaCircuit/react-media-recorder/blob/master/src/index.ts
import {
  register,
  MediaRecorder as ExtendableMediaRecorder,
  IMediaRecorder,
} from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";
import { createEffect, createSignal, onMount } from "solid-js";

export type MediaRecorderRenderProps = {
  error: string;
  muteAudio: () => void;
  unMuteAudio: () => void;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  mediaBlobUrl: undefined | string;
  status: StatusMessages;
  isAudioMuted: boolean;
  previewStream: MediaStream | null;
  previewAudioStream: MediaStream | null;
  clearBlobUrl: () => void;
};

export type MediaRecorderHookProps = {
  audio?: boolean | MediaTrackConstraints;
  video?: boolean | MediaTrackConstraints;
  screen?: boolean;
  onStop?: (blobUrl: string, blob: Blob) => void;
  onStart?: () => void;
  blobPropertyBag?: BlobPropertyBag;
  mediaRecorderOptions?: MediaRecorderOptions | undefined;
  customMediaStream?: MediaStream | null;
  stopStreamsOnStop?: boolean;
  askPermissionOnMount?: boolean;
};

export type StatusMessages =
  | "media_aborted"
  | "permission_denied"
  | "no_specified_media_found"
  | "media_in_use"
  | "invalid_media_constraints"
  | "no_constraints"
  | "recorder_error"
  | "idle"
  | "acquiring_media"
  | "delayed_start"
  | "recording"
  | "stopping"
  | "stopped"
  | "paused";

export enum RecorderErrors {
  AbortError = "media_aborted",
  NotAllowedError = "permission_denied",
  NotFoundError = "no_specified_media_found",
  NotReadableError = "media_in_use",
  OverconstrainedError = "invalid_media_constraints",
  TypeError = "no_constraints",
  NONE = "",
  NO_RECORDER = "recorder_error",
}

export function useMediaRecorder({
  audio = true,
  video = false,
  onStop = () => null,
  onStart = () => null,
  blobPropertyBag,
  screen = false,
  mediaRecorderOptions = undefined,
  customMediaStream = null,
  stopStreamsOnStop = true,
  askPermissionOnMount = false,
}: MediaRecorderHookProps) {
  let mediaRecorder: IMediaRecorder | null = null;
  let mediaChunks: Blob[] = [];
  let mediaStream: MediaStream | null = null;
  const [status, setStatus] = createSignal<StatusMessages>("idle");
  const [isAudioMuted, setIsAudioMuted] = createSignal<boolean>(false);
  const [mediaBlobUrl, setMediaBlobUrl] = createSignal<string | undefined>(
    undefined,
  );
  const [error, setError] = createSignal<keyof typeof RecorderErrors>("NONE");

  onMount(() => {
    const setup = async () => {
      await register(await connect());
    };
    setup();
  });

  const getMediaStream = async () => {
    setStatus("acquiring_media");
    const requiredMedia: MediaStreamConstraints = {
      audio: typeof audio === "boolean" ? !!audio : audio,
      video: typeof video === "boolean" ? !!video : video,
    };
    try {
      if (customMediaStream) {
        mediaStream = customMediaStream;
      } else if (screen) {
        const stream = (await window.navigator.mediaDevices.getDisplayMedia({
          video: video || true,
        })) as MediaStream;
        stream.getVideoTracks()[0].addEventListener("ended", () => {
          stopRecording();
        });
        if (audio) {
          const audioStream = await window.navigator.mediaDevices.getUserMedia({
            audio,
          });

          audioStream
            .getAudioTracks()
            .forEach((audioTrack) => stream.addTrack(audioTrack));
        }
        mediaStream = stream;
      } else {
        const stream =
          await window.navigator.mediaDevices.getUserMedia(requiredMedia);
        mediaStream = stream;
      }
      setStatus("idle");
    } catch (error: any) {
      setError(error.name);
      setStatus("idle");
    }
  };

  createEffect(() => {
    if (!window.MediaRecorder) {
      throw new Error("Unsupported Browser");
    }

    if (screen) {
      if (!window.navigator.mediaDevices.getDisplayMedia) {
        throw new Error("This browser doesn't support screen capturing");
      }
    }

    const checkConstraints = (mediaType: MediaTrackConstraints) => {
      const supportedMediaConstraints =
        navigator.mediaDevices.getSupportedConstraints();
      const unSupportedConstraints = Object.keys(mediaType).filter(
        (constraint) =>
          !(supportedMediaConstraints as { [key: string]: any })[constraint],
      );

      if (unSupportedConstraints.length > 0) {
        console.error(
          `The constraints ${unSupportedConstraints.join(
            ",",
          )} doesn't support on this browser. Please check your ReactMediaRecorder component.`,
        );
      }
    };

    if (typeof audio === "object") {
      checkConstraints(audio);
    }
    if (typeof video === "object") {
      checkConstraints(video);
    }

    if (mediaRecorderOptions && mediaRecorderOptions.mimeType) {
      if (!MediaRecorder.isTypeSupported(mediaRecorderOptions.mimeType)) {
        console.error(
          `The specified MIME type you supplied for MediaRecorder doesn't support this browser`,
        );
      }
    }

    if (!mediaStream && askPermissionOnMount) {
      getMediaStream();
    }

    return () => {
      if (mediaStream) {
        const tracks = mediaStream.getTracks();
        tracks.forEach((track) => track.clone().stop());
      }
    };
  });

  // Media Recorder Handlers

  const startRecording = async () => {
    setError("NONE");
    if (!mediaStream) {
      await getMediaStream();
    }
    if (mediaStream) {
      const isStreamEnded = mediaStream
        .getTracks()
        .some((track) => track.readyState === "ended");
      if (isStreamEnded) {
        await getMediaStream();
      }

      // User blocked the permissions (getMediaStream errored out)
      if (!mediaStream.active) {
        return;
      }
      mediaRecorder = new ExtendableMediaRecorder(
        mediaStream,
        mediaRecorderOptions || undefined,
      );
      mediaRecorder.ondataavailable = onRecordingActive;
      mediaRecorder.onstop = onRecordingStop;
      mediaRecorder.onstart = onRecordingStart;
      mediaRecorder.onerror = () => {
        setError("NO_RECORDER");
        setStatus("idle");
      };
      mediaRecorder.onpause = (e) => {};
      mediaRecorder.start();
      setStatus("recording");
    }
  };

  const onRecordingActive = ({ data }: BlobEvent) => {
    mediaChunks.push(data);
  };

  const onRecordingStart = () => {
    onStart();
  };

  const onRecordingStop = () => {
    const [chunk] = mediaChunks;
    const blobProperty: BlobPropertyBag = Object.assign(
      { type: chunk.type },
      blobPropertyBag ||
        (video ? { type: "video/mp4" } : { type: "audio/wav" }),
    );
    const blob = new Blob(mediaChunks, blobProperty);
    const url = URL.createObjectURL(blob);
    setStatus("stopped");
    setMediaBlobUrl(url);
    onStop(url, blob);
  };

  const muteAudio = (mute: boolean) => {
    setIsAudioMuted(mute);
    if (mediaStream) {
      mediaStream
        .getAudioTracks()
        .forEach((audioTrack) => (audioTrack.enabled = !mute));
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      setStatus("paused");
      mediaRecorder.pause();
    }
  };
  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "paused") {
      setStatus("recording");
      mediaRecorder.resume();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      if (mediaRecorder.state !== "inactive") {
        setStatus("stopping");
        mediaRecorder.stop();
        if (stopStreamsOnStop) {
          mediaStream &&
            mediaStream.getTracks().forEach((track) => track.stop());
        }
        mediaChunks = [];
      }
    }
  };

  let previewStream: MediaStream | null = null;
  if (mediaStream) {
    previewStream = new MediaStream(
      (mediaStream as MediaStream).getVideoTracks(),
    );
  }

  let previewAudioStream: MediaStream | null = null;
  if (mediaStream) {
    previewStream = new MediaStream(
      (mediaStream as MediaStream).getAudioTracks(),
    );
  }

  return {
    error: RecorderErrors[error()],
    muteAudio: () => muteAudio(true),
    unMuteAudio: () => muteAudio(false),
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    mediaBlobUrl,
    mediaChunks: () => mediaChunks,
    status,
    isAudioMuted,
    previewStream,
    previewAudioStream,
    clearBlobUrl: () => {
      const url = mediaBlobUrl();
      if (url) {
        URL.revokeObjectURL(url);
      }
      setMediaBlobUrl(undefined);
      setStatus("idle");
    },
  };
}
