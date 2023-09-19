import * as fs from "fs";
import { getAudioDurationInSeconds } from "get-audio-duration";
import getMP3Duration from "get-mp3-duration";
import mp3Duration from "mp3-duration";

console.log(__dirname);

const PATH = "src/scripts/experiments/get-audio-duration";

const FILE_1 = PATH + "/" + "recording-8-secs-no-duration.mp3";
const FILE_2 = PATH + "/" + "recording-2-secs-with-duration.mp3";

const findWithFFProbe = () => {
  getAudioDurationInSeconds(FILE_2).then((duration) => {
    console.log("DURATION 1:", duration);
  });

  getAudioDurationInSeconds(FILE_1).then((duration) => {
    console.log("DURATION 2:", duration);
  });
};

const findWithGetMP3Duration = () => {
  const buffer = fs.readFileSync(FILE_2);
  const duration = getMP3Duration(buffer);
  console.log("DURATION", duration, "ms");
};

const findWithMP3Duration = () => {
  mp3Duration(FILE_2, function (err, duration) {
    if (err) return console.log(err.message);
    console.log("Your file is " + duration + " seconds long");
  });
};

findWithFFProbe();
// findWithGetMP3Duration();
// findWithMP3Duration();
