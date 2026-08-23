import { useEffect, useRef, useState } from "react";

function getEmbedUrl(url) {

  try {

    const parsedUrl =
      new URL(url);

    let videoId = null;


    /*
     * YouTube Shorts
     */
    if (
      parsedUrl.pathname.startsWith(
        "/shorts/"
      )
    ) {

      videoId =
        parsedUrl.pathname
          .split("/shorts/")[1]
          .split("/")[0];

    }


    /*
     * YouTube watch
     */
    else if (
      parsedUrl.searchParams.has("v")
    ) {

      videoId =
        parsedUrl.searchParams.get("v");

    }


    /*
     * youtu.be
     */
    else if (
      parsedUrl.hostname ===
      "youtu.be"
    ) {

      videoId =
        parsedUrl.pathname.substring(1);

    }


    if (!videoId) {
      return url;
    }


    return (
      `https://www.youtube.com/embed/` +
      `${videoId}?autoplay=1&mute=1&controls=1&loop=1`
    );

  } catch {

    return url;

  }
}


function Reel({
  video,
  index,
  total,
  onNext,
}) {

  const reelRef =
    useRef(null);

  const [active, setActive] =
    useState(index === 0);


  /*
   * Detect when reel becomes visible
   */
  useEffect(() => {

    const element =
      reelRef.current;

    if (!element) {
      return;
    }


    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (
              entry.isIntersecting
            ) {

              setActive(true);


              /*
               * If user reached
               * last loaded reel,
               * fetch another one.
               */

              if (
                index === total - 1
              ) {

                onNext();

              }

            } else {

              setActive(false);

            }

          });

        },
        {
          threshold: 0.75,
        }
      );


    observer.observe(element);


    return () => {
      observer.disconnect();
    };

  }, [index, total, onNext]);


  const embedUrl =
    getEmbedUrl(video.url);


  return (

    <section
      ref={reelRef}
      className="reel"
    >

      {/* Video */}

      <div className="reel-video">

        {active && (

          <iframe
            src={embedUrl}
            title={`Reel ${index + 1}`}

            allow="
              autoplay;
              encrypted-media;
              picture-in-picture
            "

            allowFullScreen
          />

        )}

      </div>


      {/* Dark gradient */}

      <div className="reel-gradient"></div>


      {/* Top */}

      <div className="reel-top">

        <div className="brand">
          MoodReels
        </div>

        <div className="camera">
          ◉
        </div>

      </div>


      {/* Right buttons */}

      <div className="reel-actions">

        <button>
          <span>♡</span>
          <small>Like</small>
        </button>

        <button>
          <span>💬</span>
          <small>Comment</small>
        </button>

        <button>
          <span>↗</span>
          <small>Share</small>
        </button>

      </div>


      {/* Bottom information */}

      <div className="reel-info">

        <div className="profile">

          <div className="avatar">
            M
          </div>

          <strong>
            MoodReels
          </strong>

          <button className="follow">
            Follow
          </button>

        </div>


        <p>
          A video picked especially
          for your mood ✨
        </p>

      </div>

    </section>

  );
}

export default Reel;