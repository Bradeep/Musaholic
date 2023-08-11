import React, { useEffect, useState } from "react";

import Button from "../components/Button";

import { getFormattedDate } from "../utils/utilFunctions";
import ShareIcon from "../assets/share.svg";

import "./share.scss";

const ShareButton = ({ date, chances }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setIsCopied(false);
  }, [date]);

  const onclickShare = async (date, chances) => {
    chances = chances > 4 ? 4 : chances;
    const shareContent = {
      title: `Musaholic - ${getFormattedDate(date)}`,
      text: `Musaholic - ${chances}/4 \n`,
      url: "https://musaholic.herokuapp.com/",
    };
    if (navigator.share) {
      navigator.share(shareContent).then(() => {});
    } else {
      navigator.clipboard.writeText(
        `${shareContent.title} \n ${shareContent.text} \n ${shareContent.url}`
      );
      setIsCopied(true);
    }
  };

  return (
    <Button
      onClick={() => onclickShare(date, chances)}
      title={isCopied ? "Copied" : "Share"}
      customClass={"share-button"}
      icon={isCopied ? "" : ShareIcon}
      iconPosition="start"
    />
  );
};

export default ShareButton;
