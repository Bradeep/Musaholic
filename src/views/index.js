import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactAudioPlayer from "react-audio-player";

import NavBar from "../components/navBar";
import TextBar from "../components/Textbar";
import Button from "../components/Button";
import Loader from "../components/Loader";

import PlayIcon from "../assets/play.svg";
import PauseIcon from "../assets/pause.svg";
import { debounce } from "../utils/utilFunctions";
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
  const audioRef = useRef();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const res = await getSongs({}, {});
      setSongList(res.data);
      setIsLoading(false);
    };
    interceptor();
    getData();
  }, []);

  useEffect(() => {
    const tdate = selectedDate;
    const offset = tdate.getTimezoneOffset();
    const offsetDate = new Date(tdate.getTime() - offset * 60 * 1000);
    const formatDate = offsetDate.toISOString().split("T")[0];
    const todaysSong = songList[formatDate] || {};
    setTodaySong(todaysSong);
  }, [songList, selectedDate]);

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

  const onClickSkip = useCallback(() => {
    const newChn = chances + 1;
    setChances(newChn);

    if (newChn > NO_OF_CHANCES) {
      setChances(10);
    }
  }, [chances]);

  const onDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="wrapper">
      <NavBar title={"MUSAHOLIC"} onDateSelect={onDateSelect} />
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
