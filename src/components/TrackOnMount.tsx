"use client";
import { useEffect } from "react";
import { track, type EventName, type EventParams } from "@/features/analytics/track";

export function TrackOnMount<N extends EventName>({
  name,
  params,
}: {
  name: N;
  params: EventParams<N>;
}) {
  const key = JSON.stringify(params);
  useEffect(() => {
    track(name, JSON.parse(key) as EventParams<N>);
  }, [name, key]);
  return null;
}
