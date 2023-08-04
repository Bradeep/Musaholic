import React, { useState, useEffect } from "react";

import NavBar from "../components/navBar";
import "./index.scss";
import TextBar from "../components/Textbar";
import Button from "../components/Button";

import PlayIcon from "../assets/play.svg";
import { debounce } from "../utils/utilFunctions";
import { getRequest } from "../service/apiRequest";
import { interceptor } from "../service/interceptor";

const App = () => {
  const [suggestions, setSuggestions] = useState([]);

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
            Click to play audio for <br /> 3 seconds
          </div>
          <img
            src={PlayIcon}
            height={64}
            width={64}
            className="content-icon--play"
            alt="play"
          />
          <TextBar onSearch={onSearch} suggestions={suggestions} />
          <div className="content-buttons">
            <Button buttonColor="rgb(30, 215, 96)">Submit</Button>
            <Button buttonColor="rgb(237, 95, 74)">{"Skip (+3s)"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
