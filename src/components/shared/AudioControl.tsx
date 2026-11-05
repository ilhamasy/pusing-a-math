"use client";

import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { sounds } from "@/lib/sound";

export function AudioControl() {
  const [enabled, setEnabled] = useState(true);

  const toggleSound = () => {
    const nextState = !enabled;
    sounds.setEnabled(nextState);
    setEnabled(nextState);
    if (nextState) {
      sounds.playPop();
    }
  };

  return (
    <button
      onClick={toggleSound}
      type="button"
      aria-label={enabled ? "Mute sounds" : "Enable sounds"}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all active:scale-95 text-sm font-semibold shadow-sm cursor-pointer"
    >
      {enabled ? (
        <>
          <Volume2 className="w-4 h-4 text-[#FFD166]" />
          <span className="hidden sm:inline text-xs text-white/90">Sound On</span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-white/50" />
          <span className="hidden sm:inline text-xs text-white/60">Muted</span>
        </>
      )}
    </button>
  );
}
