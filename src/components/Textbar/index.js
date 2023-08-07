import React, { useState, useRef, useEffect } from "react";
import "./index.scss";

const TextBar = ({
  className,
  placeholder = "Start Guessing...",
  onSearch,
  suggestions = [],
}) => {
  const TextBarRef = useRef(null);

  const [value, setValue] = useState("");
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [TextBarRef]);

  const handleOutsideClick = (event) => {
    if (TextBarRef.current && !TextBarRef.current.contains(event.target)) {
      setIsSuggestionOpen(false);
    }
  };

  const onChange = (e) => {
    setValue(e.value);
    if (e.value?.length > 2) {
      onSearch(e.value);
      setIsSuggestionOpen(true);
    } else setIsSuggestionOpen(false);
  };

  const onClickSuggestion = (suggestion) => {
    setValue(suggestion);
    onSearch(suggestion);
    setIsSuggestionOpen(false);
  };

  return (
    <div className={`textbar-wrapper ${className}`} ref={TextBarRef}>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        style={{
          padding: "8px",
          border: "1px solid #999",
          borderRadius: "8px",
          width: "300px",
        }}
        onChange={(e) => onChange(e.target)}
      />
      {suggestions.length > 0 && isSuggestionOpen && (
        <div className="text_box-suggestion--wrapper">
          {suggestions.map((suggestion, index) => (
            <div
              value={suggestion}
              className="text_box-suggestion--text"
              onClick={() => onClickSuggestion(suggestion)}
              key={`search-bar-suggestion-${index}`}
            >
              <span>* {suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextBar;
