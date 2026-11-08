'use client';

import React, { useMemo, useRef } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { UgcAdComposition } from '@/server/video/remotion-composition/UgcAdComposition';
import { parseScriptToCues } from '@/server/video/remotion-composition/subtitle-parser';

interface RemotionUgcPlayerProps {
  avatarUrl: string;
  scriptText: string;
  ctaText?: string;
  brandName?: string;
  isPlaying?: boolean;
}

export const RemotionUgcPlayer: React.FC<RemotionUgcPlayerProps> = ({
  avatarUrl,
  scriptText,
  ctaText = 'Découvrir l\'offre 👉',
  brandName = 'AI UGC Studio'
}) => {
  const playerRef = useRef<PlayerRef>(null);

  const durationInSeconds = 20;
  const fps = 30;
  const durationInFrames = durationInSeconds * fps;

  // Memoize timed cues based on the current user script
  const subtitleCues = useMemo(() => {
    return parseScriptToCues(scriptText, fps, durationInSeconds);
  }, [scriptText]);

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-black overflow-hidden select-none">
      <Player
        ref={playerRef}
        component={UgcAdComposition}
        inputProps={{
          avatarUrl,
          scriptText,
          subtitles: subtitleCues,
          ctaText,
          brandName,
          aspectRatio: '9:16',
          accentColor: '#d4af37'
        }}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={1080}
        compositionHeight={1920}
        style={{
          width: '100%',
          height: '100%',
          aspectRatio: '9 / 16'
        }}
        controls
        loop
        autoPlay={false}
      />
    </div>
  );
};
