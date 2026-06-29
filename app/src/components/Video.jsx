"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "@/utils/AuthContext";
import { useAd } from "@/utils/AdContext";
import Spinner from "@/utils/Spinner";

import ReactPlayer from "react-player";

export default function Video({ url, videoId }) {
  const { user, addToUserCompletedVideos, userAds } = useAuth();
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [adPlaying, setAdPlaying] = useState(false);
  const [adPlayed, setAdPlayed] = useState(false);
  const [adData, setAdData] = useState(null);
  const { adDataPending, getRandomData, cumulativeAdData } = useAd();

  const handleEnded = useCallback(() => {
    addToUserCompletedVideos(videoId);
  }, [videoId, addToUserCompletedVideos]);

  const memoizedUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${url}&rel=0`,
    [url]
  );

  useEffect(() => {
    if (adDataPending || !cumulativeAdData) return;
    const ad = getRandomData();
    setAdData(ad);
  }, [cumulativeAdData]);

  if (user && adDataPending) return <Spinner />;

  return (
    <div className="relative">
      {user && userAds && adData && !adPlayed && (
        <div
          className="adVideoContainer absolute inset-0 cursor-pointer"
          onClick={() => {
            setAdPlaying(true);
          }}
        >
          <ReactPlayer
            url={adData.video}
            playing={adPlaying}
            width="100%"
            height="100%"
            className="w-full"
            onEnded={() => {
              setAdPlaying(false);
              setAdPlayed(true);
              setPlaying(true);
            }}
            style={{
              aspectRatio: "16/9",
              maxHeight: "71vh",
              backgroundColor: "#000",
              opacity: `${adPlaying ? 1 : 0}`,
            }}
          />
        </div>
      )}

      <ReactPlayer
        ref={playerRef}
        url={memoizedUrl}
        playing={playing}
        controls={true}
        width="100%"
        height="100%"
        className="w-full"
        style={{
          aspectRatio: "16/9",
          maxHeight: "71vh",
        }}
        onEnded={handleEnded}
      />
    </div>
  );
}
