"use client";

import { useState } from "react";
import { useCallContext } from "@/app/(call)/layout";
import GuessTheObject from "./GuessTheObject";
import HelpWords from "./HelpWords";
import TopicContent from "./TopicContent";
import ActivityCard from "./ActivityCard";

export default function ActivityContent() {
  const { activeCard, setActiveCard, isLeader } = useCallContext();
  const [timerEnded, setTimerEnded] = useState(false);

  if (activeCard === "object") {
    return (
      <div className="flex flex-col gap-12 h-full">
        <GuessTheObject onTimerEndChange={setTimerEnded} />
        {!timerEnded && <HelpWords />}
      </div>
    );
  }

  if (activeCard === "topic") {
    return (
      <div className="flex flex-col gap-12 h-full">
        <TopicContent />
        <HelpWords />
      </div>
    );
  }

  if (isLeader) {
    return (
      <div className="flex flex-col justify-center items-center gap-8 h-full">
        <img src="/Call/iconsax-mouse-square.svg" alt="" className="w-7 h-7" />
        <div className="flex flex-col gap-3">
          <h2 className="text-dark text-xl font-semibold text-center">
            Choose an activity
          </h2>
          <p className="text-dark-50 text-sm font-normal text-center hidden md:block">
            Choose one of the options
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full md:hidden">
          <ActivityCard
            icon="/Call/iconsax-gallery.svg"
            title="Guess the object"
            description="Explain the picture. Your partner tries to guess the object"
            alt="gallery icon"
            isPressed={activeCard === "object"}
            object={true}
            onClick={() =>
              setActiveCard(activeCard === "object" ? null : "object")
            }
            disabled={true}
            badge="soon"
          />
          <ActivityCard
            icon="/Call/iconsax-message-notif.svg"
            title="Suggest a topic"
            description="Get a topic for discussion"
            alt="message notification icon"
            isPressed={activeCard === "topic"}
            topic={true}
            onClick={() =>
              setActiveCard(activeCard === "topic" ? null : "topic")
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-8 h-full">
      <img src="/Call/iconsax-mouse-square.svg" alt="" className="w-7 h-7" />
      <div className="flex flex-col gap-3">
        <h2 className="text-dark text-xl font-semibold text-center">
          Waiting for partner
        </h2>
        <p className="text-dark-50 text-sm font-normal text-center">
          Your partner is choosing
          <br />
          an activity to begin.
        </p>
      </div>
    </div>
  );
}
