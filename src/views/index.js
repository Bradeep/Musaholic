import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactAudioPlayer from "react-audio-player";

import Countdown from "./countDown";

import NavBar from "../components/navBar";
import TextBar from "../components/Textbar";
import Button from "../components/Button";
import Loader from "../components/Loader";

import PlayIcon from "../assets/play.svg";
import PauseIcon from "../assets/pause.svg";
import { debounce, getFormattedDate } from "../utils/utilFunctions";
import { getRequest, getSongs } from "../service/apiRequest";
import { interceptor } from "../service/interceptor";

import "./index.scss";

const NO_OF_CHANCES = 4;

const App = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [songList, setSongList] = useState({});
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chances, setChances] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todaySong, setTodaySong] = useState({});
  const [guesses, setGuesses] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isAnswerFound, setIsAnswerFound] = useState(false);
  const audioRef = useRef();

  useEffect(() => {
    const getData = async () => {
      const res = await getSongs({}, {});
      setSongList(res.data);
    };
    interceptor();
    getData();
  }, []);

  useEffect(() => {
    const formatDate = getFormattedDate(selectedDate);
    const todaysSong = songList[formatDate] || {};
    setTodaySong(todaysSong);
  }, [songList, selectedDate]);

  const onSearch = debounce(async (value) => {
    setCurrentInput(value);
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

  const onAudioPlay = useCallback(() => {
    var player = audioRef.current.audioEl.current;

    setTimeout(function () {
      player.pause();
      player.currentTime = 0;
      setIsAudioPlaying(false);
    }, chances * 3000);
  }, [chances]);

  const onclickPlayButton = useCallback(() => {
    !isAudioPlaying
      ? audioRef.current.audioEl.current.play()
      : audioRef.current.audioEl.current.pause();
    setIsAudioPlaying(!isAudioPlaying);
  }, [isAudioPlaying]);

  const onClickSubmit = () => {
    if (currentInput === "") return;
    const guess = guesses;

    if (currentInput.toLowerCase().includes(todaySong?.answer?.toLowerCase())) {
      setChances(10);
      setIsAnswerFound(true);
      guess.push("🟢 " + currentInput.toLowerCase());
    } else {
      setChances((chance) => chance + 1);
      guess.push("🔴 " + currentInput.toLowerCase());
    }
  };

  const onClickSkip = useCallback(() => {
    const newChn = chances + 1;
    setChances(newChn);

    const guess = guesses;
    guess.push("🔴 Skipped");
    setGuesses(guess);

    if (newChn > NO_OF_CHANCES) {
      setChances(10);
    }
  }, [chances, guesses]);

  const onDateSelect = (date) => {
    setSelectedDate(date);
    setIsLoading(true);
    setGuesses([]);
    setChances(1);
    setIsAnswerFound(false);
  };

  return (
    <div className="wrapper">
      <NavBar title={"MUSAHOLIC"} onDateSelect={onDateSelect} />
      <div className="content-wrapper">
        <div className="content-title">Guess the song</div>
        <div className="content-data">
          <div className="image-wrapper">
            {chances > 4 ? (
              <img
                src={todaySong.picture}
                alt="pic"
                height={"150px"}
                width={"150px"}
              />
            ) : (
              <div className="image-question">?</div>
            )}
          </div>

          <div className="content-info--guess">Guess</div>
          <div className="content-info--text">
            Click to play audio for <br /> {chances * 3} seconds
          </div>

          <ReactAudioPlayer
            src={todaySong.url}
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
          {chances > 4 ? (
            <div className="content-final_state">
              <div className="title">{todaySong?.answer}</div>
              <div
                className="status"
                style={{
                  color: isAnswerFound ? "#1ed760" : "red",
                  fontSize: "17px",
                }}
              >
                {isAnswerFound ? "You Guessed Correct" : "Guessed Wrong"}
              </div>
            </div>
          ) : (
            <>
              <TextBar onSearch={onSearch} suggestions={suggestions} />

              <div className="content-buttons">
                <Button buttonColor="rgb(30, 215, 96)" onClick={onClickSubmit}>
                  Submit
                </Button>
                <Button buttonColor="rgb(237, 95, 74)" onClick={onClickSkip}>
                  {"Skip (+3s)"}
                </Button>
              </div>
            </>
          )}
          <div className="content-guess--history">
            {guesses.map((each) => {
              return (
                <input
                  type={"text"}
                  style={{ color: "white", borderRadius: "6px" }}
                  disabled
                  value={each}
                />
              );
            })}
          </div>
          {chances > 4 && <Countdown />}
        </div>
      </div>
    </div>
  );
};

export default App;
