import React, { useState, useEffect, useRef } from "react";
import ReactAudioPlayer from "react-audio-player";

import NavBar from "../components/navBar";
import TextBar from "../components/Textbar";
import Button from "../components/Button";
import Loader from "../components/Loader";

import PlayIcon from "../assets/play.svg";
import PauseIcon from "../assets/pause.svg";
import { debounce } from "../utils/utilFunctions";
import { getRequest } from "../service/apiRequest";
import { interceptor } from "../service/interceptor";

import "./index.scss";

const NO_OF_CHANCES = 4;

const App = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chances, setChances] = useState(1);
  const audioRef = useRef();

  useEffect(() => {
    interceptor();
  }, []);

  const onSearch = debounce(async (value) => {
    const requestUrl = `/v1/search?q=${value}&type=track,album&market=IN&include_external=audio&limit=8`;
    try {
      const res = await getRequest(requestUrl, null, {});
      const data = res.data.tracks.items;
      const resultArray = [];
      Object.keys(data).forEach((each) => {
        if (
          ["single", "compilation", "album"].includes(
            data[each].album.album_type
          )
        ) {
          const name = data[each].name;
          resultArray.push(name);
        }
      });
      setSuggestions(resultArray);
    } catch (error) {}
  }, 500);

  const onAudioPlay = () => {
    var player = audioRef.current.audioEl.current;

    setTimeout(function () {
      player.pause();
      player.currentTime = 0;
      setIsAudioPlaying(false);
    }, chances * 3000);
  };

  const onclickPlayButton = () => {
    !isAudioPlaying
      ? audioRef.current.audioEl.current.play()
      : audioRef.current.audioEl.current.pause();
    setIsAudioPlaying(!isAudioPlaying);
  };

  const onClickSkip = () => {
    // const guess = guesses;
    const newChn = chances + 1;
    setChances(newChn);
    // setValue(null);
    // inputRef.current.value = "";
    // setEndTime(endTime + 3000);
    if (newChn > NO_OF_CHANCES) {
      setChances(10);
    }
    // guess.push('🔴 '+ 'Skipped')
    // setGuesses(guess)
    // setDisplayMessage(`${newChn} chances left`);
  };

  return (
    <div className="wrapper">
      <NavBar title={"MUSAHOLIC"} />
      <div className="content-wrapper">
        <div className="content-title">Guess the song</div>
        <div className="content-data">
          <div className="image-wrapper">
            <div className="image-question">?</div>
          </div>
          <div className="content-info--guess">Guess</div>
          <div className="content-info--text">
            Click to play audio for <br /> {chances * 3} seconds
          </div>
          <ReactAudioPlayer
            src={
              "https://audio.jukehost.co.uk/yRmqdME1c5A4Wr6x3a7vxcF3l241qCTe"
            }
            ref={audioRef}
            onLoadedMetadata={() => setIsLoading(false)}
            onPlay={() => onAudioPlay()}
          />
          {isLoading ? (
            <Loader className="content-loader" />
          ) : (
            <img
              src={isAudioPlaying ? PauseIcon : PlayIcon}
              height={64}
              width={64}
              className="content-icon--play"
              alt="play"
              onClick={onclickPlayButton}
            />
          )}
          <TextBar onSearch={onSearch} suggestions={suggestions} />
          <div className="content-buttons">
            <Button buttonColor="rgb(30, 215, 96)">Submit</Button>
            <Button buttonColor="rgb(237, 95, 74)" onClick={onClickSkip}>
              {"Skip (+3s)"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
