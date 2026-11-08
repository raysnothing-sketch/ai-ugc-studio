'use client';

import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';
import { UgcCompositionProps } from './types';
import { KineticSubtitles } from './KineticSubtitles';

export const UgcAdComposition: React.FC<UgcCompositionProps> = ({
  avatarUrl,
  bRollMediaUrls = [],
  subtitles,
  ctaText,
  brandName = 'AI UGC Studio',
  accentColor = '#d4af37'
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Subtle breathing/cinematic zoom on avatar
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.08]);

  // CTA Entrance spring in last 4 seconds
  const ctaStartFrame = Math.max(0, durationInFrames - 4 * fps);
  const ctaProgress = spring({
    frame: Math.max(0, frame - ctaStartFrame),
    fps,
    config: { damping: 12, mass: 0.6 }
  });
  const ctaTranslateY = interpolate(ctaProgress, [0, 1], [60, 0]);
  const ctaOpacity = interpolate(ctaProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0c0d0f', overflow: 'hidden' }}>
      {/* 1. Main Avatar / Visual Layer with Cinematic Push-in */}
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
        <Img
          src={avatarUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        {/* Subtle Dark Vignette for Contrast */}
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0.85) 100%)'
          }}
        />
      </AbsoluteFill>

      {/* 2. Top Header Brand Pill */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 16px',
          borderRadius: 9999,
          backgroundColor: 'rgba(18, 20, 24, 0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          zIndex: 20
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: accentColor,
            boxShadow: `0 0 10px ${accentColor}`
          }}
        />
        <span
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: 13,
            fontWeight: 700,
            color: '#f5f5f3',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}
        >
          {brandName}
        </span>
      </div>

      {/* 3. OpenShorts-inspired Kinetic Subtitles Overlay */}
      <KineticSubtitles cues={subtitles} accentColor={accentColor} />

      {/* 4. Bottom Call-To-Action Banner (Animated Entry) */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 20,
          right: 20,
          transform: `translateY(${ctaTranslateY}px)`,
          opacity: ctaOpacity,
          zIndex: 35
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${accentColor} 0%, #e6c05d 50%, #927320 100%)`,
            color: '#0c0d0f',
            borderRadius: 14,
            padding: '14px 20px',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(212, 175, 55, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10
          }}
        >
          <span
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: 15,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            {ctaText}
          </span>
          <span style={{ fontSize: 18 }}>👉</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
