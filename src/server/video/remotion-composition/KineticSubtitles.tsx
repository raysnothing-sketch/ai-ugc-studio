'use client';

import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { SubtitleCue } from './types';

interface KineticSubtitlesProps {
  cues: SubtitleCue[];
  accentColor?: string;
}

export const KineticSubtitles: React.FC<KineticSubtitlesProps> = ({
  cues,
  accentColor = '#d4af37'
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find active cue for current frame
  const activeCue = cues.find(
    (c) => frame >= c.startFrame && frame <= c.endFrame
  );

  if (!activeCue) return null;

  // Spring animation for punchy entry of each phrase
  const progress = spring({
    frame: frame - activeCue.startFrame,
    fps,
    config: {
      damping: 12,
      mass: 0.5,
      stiffness: 150
    }
  });

  const scale = interpolate(progress, [0, 1], [0.92, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '22%',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 24px',
        pointerEvents: 'none',
        zIndex: 30
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          backgroundColor: 'rgba(12, 13, 15, 0.85)',
          backdropFilter: 'blur(10px)',
          border: `1.5px solid ${accentColor}`,
          boxShadow: `0 0 25px rgba(212, 175, 55, 0.35)`,
          padding: '10px 20px',
          borderRadius: 14,
          textAlign: 'center',
          maxWidth: '92%'
        }}
      >
        <span
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: 22,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: '#f5f5f3',
            lineHeight: 1.25,
            textShadow: '0 2px 8px rgba(0,0,0,0.8)'
          }}
        >
          {activeCue.text}
        </span>
      </div>
    </div>
  );
};
