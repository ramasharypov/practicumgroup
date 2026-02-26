import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PracticumLogo } from './practicum-logos';
import { AccentStar } from './accent-star';
import { HelpContent } from './help-content';
import { MediaContent } from './media-content';
import { SchoolContent } from './school-content';

export type PanelId = 'help' | 'school' | 'media';

/* ── Derived from approved palette ── */
const CLR = {
  bg: '#F9F9F9',
  text: '#1B1D20',
  base: '#012168',
  border: 'rgba(1, 33, 104, 0.1)',
  muted: 'rgba(27, 29, 32, 0.45)',
};

interface TriadPanelProps {
  id: PanelId;
  isActive: boolean;
  isNeutral: boolean;
  onClick: () => void;
  index: number;
}

const PANEL_CONFIG: Record<PanelId, {
  label: string;
  subtitle: string;
  color: string;
  colorRgb: string;
}> = {
  help: {
    label: 'HELP',
    subtitle: 'Терапия',
    color: '#069B93',
    colorRgb: '6, 155, 147',
  },
  school: {
    label: 'SCHOOL',
    subtitle: 'Обучение',
    color: '#1192E6',
    colorRgb: '17, 146, 230',
  },
  media: {
    label: 'MEDIA',
    subtitle: 'Просвещение',
    color: '#FF5E0E',
    colorRgb: '255, 94, 14',
  },
};

/*
 * Panel component — normal flow, no carousel bullshit.
 * 
 * NEUTRAL state: show centered title
 * ACTIVE state: show full content
 * Everything in NORMAL DOCUMENT FLOW for global scroll.
 */
export function TriadPanel({
  id,
  isActive,
  isNeutral,
  onClick,
  index,
}: TriadPanelProps) {
  const config = PANEL_CONFIG[id];
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      style={{ cursor: isActive ? 'default' : isNeutral ? 'pointer' : 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (!isActive && isNeutral) onClick(); }}
    >
      {/* Background tint */}
      <div
        className="absolute inset-0 transition-colors duration-700 pointer-events-none"
        style={{
          backgroundColor: isActive
            ? CLR.bg
            : hovered && isNeutral
              ? `rgba(1, 33, 104, 0.03)`
              : CLR.bg,
        }}
      />

      {/* Accent bar on left edge */}
      <div
        className="absolute left-0 top-0 bottom-0 z-10 transition-all duration-500 pointer-events-none"
        style={{
          backgroundColor: config.color,
          width: isActive ? 3 : hovered && isNeutral ? 2 : 0,
        }}
      />

      {/* NEUTRAL STATE — centered title */}
      {isNeutral && (
        <div className="min-h-[calc(100vh-129px)] flex flex-col items-center justify-center p-8">
          <div className="flex flex-col items-center gap-2">
            <PracticumLogo
              id={id}
              height={36}
              className="transition-opacity duration-500 select-none"
              style={{
                color: '#1B1D20',
              }}
            />
          </div>
        </div>
      )}

      {/* ACTIVE STATE — full content */}
      {isActive && (
        <div className="relative z-10">
          <PanelContent id={id} color={config.color} colorRgb={config.colorRgb} />
        </div>
      )}
    </div>
  );
}

/* ─── Content ─── */

function PanelContent({ id, color, colorRgb }: { id: PanelId; color: string; colorRgb: string }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (id === 'help') return <HelpContent color={color} colorRgb={colorRgb} />;
  
  if (id === 'school') {
    return (
      <SchoolContent
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setIsLoggedIn(true)}
        onProfileClick={() => navigate('/school/profile')}
      />
    );
  }
  
  if (id === 'media') {
    return (
      <MediaContent
        onNavigateToSchool={() => navigate('/school')}
      />
    );
  }
  
  return null;
}