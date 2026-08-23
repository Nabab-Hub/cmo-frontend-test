import { useState } from "react";

const moods = [
  {
    id: "chill",
    emoji: "😌",
    name: "Chill",
  },
  {
    id: "happy",
    emoji: "😄",
    name: "Happy",
  },
  {
    id: "focus",
    emoji: "🧠",
    name: "Focus",
  },
  {
    id: "romantic",
    emoji: "❤️",
    name: "Romantic",
  },
  {
    id: "crystal",
    emoji: "🔮",
    name: "Crystal",
  },
];


function MoodSelector({
  mood,
  onChange,
}) {

  const [open, setOpen] =
    useState(false);


  const currentMood =
    moods.find(
      (item) => item.id === mood
    );


  const selectMood = (newMood) => {

    setOpen(false);

    if (newMood === mood) {
      return;
    }

    onChange(newMood);
  };


  return (

    <div className="mood-selector">

      {/* Dropdown */}

      {open && (

        <div className="mood-menu">

          <div className="menu-title">
            Choose your mood
          </div>


          {moods.map((item) => (

            <button
              key={item.id}

              className={
                item.id === mood
                  ? "mood-option active"
                  : "mood-option"
              }

              onClick={() =>
                selectMood(item.id)
              }
            >

              <span>
                {item.emoji}
              </span>

              <span>
                {item.name}
              </span>

              {item.id === mood && (
                <span className="check">
                  ✓
                </span>
              )}

            </button>

          ))}

        </div>

      )}


      {/* Current mood */}

      <button
        className="mood-button"

        onClick={() =>
          setOpen(!open)
        }
      >

        <span>
          {currentMood?.emoji}
        </span>

        <span>
          {currentMood?.name}
        </span>

        <span className="arrow">
          {open ? "⌄" : "⌃"}
        </span>

      </button>

    </div>

  );
}

export default MoodSelector;