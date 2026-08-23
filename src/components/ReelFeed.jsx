import { useEffect, useRef, useState } from "react";
import Reel from "./Reel";
import MoodSelector from "./MoodSelector";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8087";

const DEFAULT_MOOD = "chill";

function ReelFeed() {
  const [mood, setMood] = useState(DEFAULT_MOOD);

  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const isFetching = useRef(false);


  /*
   * Fetch one video from API
   */
  const fetchVideo = async (selectedMood) => {

    if (isFetching.current) {
      return null;
    }

    try {

      isFetching.current = true;

      const response = await fetch(
        `${API_URL}/suggest_video`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            mood: selectedMood,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to fetch video"
        );
      }


      return data.video;

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Something went wrong"
      );

      return null;

    } finally {

      isFetching.current = false;

    }
  };


  /*
   * Initial video
   */
  useEffect(() => {

    loadInitialVideo();

  }, []);


  const loadInitialVideo = async () => {

    setLoading(true);

    const video = await fetchVideo(
      DEFAULT_MOOD
    );

    if (video) {

      setVideos([
        {
          id: Date.now(),
          url: video,
        },
      ]);

    }

    setLoading(false);
  };


  /*
   * When user changes mood
   */
  const handleMoodChange = async (
    newMood
  ) => {

    setMood(newMood);

    setError("");

    setLoading(true);

    /*
     * Remove old reels
     */
    setVideos([]);


    /*
     * Get new reel
     */
    const video = await fetchVideo(
      newMood
    );


    if (video) {

      setVideos([
        {
          id: Date.now(),
          url: video,
        },
      ]);

    }

    setLoading(false);
  };


  /*
   * Load next reel
   */
  const loadNextVideo = async () => {

    const video = await fetchVideo(mood);

    if (!video) {
      return;
    }

    setVideos((current) => [
      ...current,

      {
        id:
          Date.now() +
          Math.random(),

        url: video,
      },
    ]);

  };


  return (
    <div className="feed-wrapper">

      {/* Reels */}

      <div className="reels-feed">

        {videos.map((video, index) => (

          <Reel
            key={video.id}

            video={video}

            index={index}

            total={videos.length}

            onNext={loadNextVideo}
          />

        ))}


        {/* Initial loading */}

        {loading &&
          videos.length === 0 && (

            <div className="loading-screen">

              <div className="loader"></div>

              <p>
                Finding something for you...
              </p>

            </div>

          )}


        {/* Error */}

        {error &&
          videos.length === 0 && (

            <div className="error-screen">

              <p>{error}</p>

              <button
                onClick={() =>
                  handleMoodChange(mood)
                }
              >
                Try Again
              </button>

            </div>

          )}

      </div>


      {/* Fixed mood selector */}

      <MoodSelector
        mood={mood}
        onChange={handleMoodChange}
      />

    </div>
  );
}

export default ReelFeed;