import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Countdown from "react-countdown";

import { IoMdClose } from "react-icons/io";
import { useAd } from "@/utils/AdContext";
import Spinner from "@/utils/Spinner";
import { useAuth } from "@/utils/AuthContext";

export default function FullPageAd() {
  const { user, userAds } = useAuth();
  const [adData, setAdData] = useState(null);
  const [adState, setAdState] = useState(true);
  const { adDataPending, getRandomData, cumulativeAdData } = useAd();

  useEffect(() => {
    if (adDataPending || !cumulativeAdData) return;
    const ad = getRandomData();
    setAdData(ad);
  }, [cumulativeAdData]);
  if (adDataPending || !adData) return <Spinner />;
  const renderer = ({ seconds }) => {
    if (seconds - 4 <= 0) {
      return (
        <span onClick={() => setAdState(false)} className="cursor-pointer">
          <IoMdClose size={20} />
        </span>
      );
    } else {
      return (
        <span className="text-sm font-bold text-white">{seconds - 4}</span>
      );
    }
  };

  if (!user || !userAds) return null;

  return (
    <>
      {adState && adData && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(0,0,0,0.5)] p-4">
          <div className="relative px-6">
            <div className="absolute right-2 top-0 z-[9999] mt-[-18px] flex h-[36px] w-[36px] items-center justify-center rounded-full bg-primary text-white">
              <Countdown
                date={Date.now() + 1000 * 8}
                renderer={renderer}
                onComplete={() => setAdState(false)}
              />
            </div>
            <Link
              href={`https://pariksha.solutions/colleges/${adData.link}`}
              target="_blank"
            >
              <picture>
                <source
                  media="(max-width: 800px)"
                  srcSet={adData.fullPageMobile}
                />
                <source
                  media="(min-width: 800px)"
                  srcSet={adData.fullPageDesktop}
                />
                <Image
                  src={adData.fullPageDesktop}
                  alt={adData.link}
                  height={100}
                  width={1100}
                />
              </picture>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
