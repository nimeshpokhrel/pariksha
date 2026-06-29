"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";

import { getAds } from "@/hooks/ad";

const AdContext = createContext();

export function AdProvider({ children }) {
  const [cumulativeSum, setCumulativeSum] = useState([]);

  const { data, isPending } = useQuery({
    queryKey: ["ads-data"],
    queryFn: () => getAds(),
    refetchOnWindowFocus: false,
    retry: false,
  });
  useEffect(() => {
    if (data && data.length > 0) {
      const totalProb = data.reduce((acc, obj) => acc + obj.probability, 0);
      const normalizedData = data.map((obj) => ({
        value: obj.value,
        probability: obj.probability / totalProb,
      }));
      const dataSum = [];
      normalizedData.reduce((acc, obj) => {
        acc += obj.probability;
        dataSum.push(acc);
        return acc;
      }, 0);
      setCumulativeSum(dataSum);
    }
  }, [data]);

  const getRandomData = () => {
    const randNum = Math.random();
    for (let i = 0; i < cumulativeSum.length; i++) {
      if (randNum < cumulativeSum[i]) {
        return data[i].value;
      }
    }
  };

  return (
    <AdContext.Provider
      value={{
        getRandomData,
        adDataPending: isPending,
        cumulativeAdData: cumulativeSum,
      }}
    >
      {children}
    </AdContext.Provider>
  );
}

export function useAd() {
  return useContext(AdContext);
}
