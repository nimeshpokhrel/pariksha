import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAd } from "@/utils/AdContext";
import Spinner from "@/utils/Spinner";
import { useAuth } from "@/utils/AuthContext";

export default function BannerAd({ currentPage, className }) {
  const { user, userAds } = useAuth();
  const [adData, setAdData] = useState(null);
  const { adDataPending, getRandomData, cumulativeAdData } = useAd();

  useEffect(() => {
    if (adDataPending || !cumulativeAdData) return;
    const ad = getRandomData();
    setAdData(ad);
  }, [cumulativeAdData, currentPage]);
  if (adDataPending || !adData) return <Spinner />;
  if (!user || !userAds) return null;
  return (
    <>
      {adData && (
        <Link
          href={`https://pariksha.solutions/colleges/${adData.link}`}
          target="_blank"
          className={className}
        >
          <picture>
            <source media="(max-width: 800px)" srcSet={adData.banner200} />
            <source media="(min-width: 800px)" srcSet={adData.banner100} />
            <Image
              src={adData.banner100}
              alt={adData.link}
              height={100}
              width={1200}
            />
          </picture>
        </Link>
      )}
    </>
  );
}
