"use client";

import { useEffect, useState } from "react";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Shows "Join now" from 10 minutes before the start until the end of the consultation. */
export default function JoinMeetingButton({ meetLink, start, end }: { meetLink: string; start: Date; end: Date }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(t);
  }, []);
  const opensAt = start.getTime() - 10 * 60_000;
  const live = now >= opensAt && now <= end.getTime();
  const over = now > end.getTime();

  return (
    <div className="space-y-1">
      <Button asChild={live} disabled={!live} size="lg" className="w-full">
        {live ? (
          <a href={meetLink} target="_blank" rel="noopener noreferrer">
            <Video className="mr-2 h-4 w-4" aria-hidden /> Join now
          </a>
        ) : (
          <span>
            <Video className="mr-2 inline h-4 w-4" aria-hidden /> {over ? "Consultation ended" : "Join opens 10 min before start"}
          </span>
        )}
      </Button>
      <p className="break-all text-xs text-muted-foreground">{meetLink}</p>
    </div>
  );
}
