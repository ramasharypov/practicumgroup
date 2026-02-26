/*
 * Practicum section logos — imported from Figma.
 *
 * Each logo is "prActicum <section>" with a colored star in the A.
 * Star color identifies the section.
 *
 * help  → teal star   #069B93
 * school→ blue star   #1192E6
 * media → orange star #FF5E0E
 * group → green star  #57B745 (preloader only, not exported)
 */

import helpPaths from '../../imports/svg-o97u2f18ak';
import schoolPaths from '../../imports/svg-xgh9f7apn2';
import mediaPaths from '../../imports/svg-g9h100ep06';
import groupPaths from '../../imports/svg-jbkew87gw3';

import type { PanelId } from './triad-panel';

interface LogoProps {
  /** Height in px — width auto-scales from viewBox aspect ratio */
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Override the star fill (e.g. '#fff' on colored backgrounds) */
  starColor?: string;
}

/* ── HELP ── */
export function PracticumHelpLogo({ height = 32, className, style, starColor }: LogoProps) {
  return (
    <svg
      className={className}
      style={{ height, width: 'auto', display: 'block', ...style }}
      viewBox="0 0 282.876 60.358"
      fill="none"
    >
      <path d={helpPaths.p6b17300} fill="currentColor" />
      <path d={helpPaths.p2f9b8100} fill="currentColor" />
      <path d={helpPaths.p16f88f00} fill="currentColor" />
      <path d={helpPaths.pd621100} fill="currentColor" />
      <path d={helpPaths.pb961400} fill="currentColor" />
      <path d={helpPaths.p25fb9700} fill="currentColor" />
      <path d={helpPaths.p14689480} fill="currentColor" />
      <path d={helpPaths.p285c6180} fill="currentColor" />
      <path clipRule="evenodd" d={helpPaths.p2e4eba00} fill="currentColor" fillRule="evenodd" />
      <path clipRule="evenodd" d={helpPaths.p1d5a8d00} fill={starColor || '#069B93'} fillRule="evenodd" />
      <path d={helpPaths.p3b8c4700} fill="currentColor" />
      <path d={helpPaths.p320af300} fill="currentColor" />
      <path d={helpPaths.p282e7b00} fill="currentColor" />
      <path d={helpPaths.p36671240} fill="currentColor" />
    </svg>
  );
}

/* ── SCHOOL ── */
export function PracticumSchoolLogo({ height = 32, className, style, starColor }: LogoProps) {
  return (
    <svg
      className={className}
      style={{ height, width: 'auto', display: 'block', ...style }}
      viewBox="0 0 282.876 60.366"
      fill="none"
    >
      <path d={schoolPaths.p17f050c0} fill="currentColor" />
      <path d={schoolPaths.p1919af00} fill="currentColor" />
      <path d={schoolPaths.p20466f00} fill="currentColor" />
      <path d={schoolPaths.p1ad6b600} fill="currentColor" />
      <path d={schoolPaths.p241d8f80} fill="currentColor" />
      <path d={schoolPaths.p2af9e00} fill="currentColor" />
      <path d={schoolPaths.p3f856870} fill="currentColor" />
      <path d={schoolPaths.pfa63000} fill="currentColor" />
      <path clipRule="evenodd" d={schoolPaths.p993c880} fill="currentColor" fillRule="evenodd" />
      <path clipRule="evenodd" d={schoolPaths.p8275a00} fill={starColor || '#1192E6'} fillRule="evenodd" />
      <path d={schoolPaths.p38463200} fill="currentColor" />
      <path d={schoolPaths.p2d15ba00} fill="currentColor" />
      <path d={schoolPaths.p1fbc4900} fill="currentColor" />
      <path d={schoolPaths.p1c653f0} fill="currentColor" />
      <path d={schoolPaths.p2c3c4080} fill="currentColor" />
      <path d={schoolPaths.p622c600} fill="currentColor" />
    </svg>
  );
}

/* ── MEDIA ── */
export function PracticumMediaLogo({ height = 32, className, style, starColor }: LogoProps) {
  return (
    <svg
      className={className}
      style={{ height, width: 'auto', display: 'block', ...style }}
      viewBox="0 0 282.876 60.548"
      fill="none"
    >
      <path d={mediaPaths.p37d65f00} fill="currentColor" />
      <path d={mediaPaths.p26f2d300} fill="currentColor" />
      <path d={mediaPaths.p2dbc6630} fill="currentColor" />
      <path d={mediaPaths.pc698300} fill="currentColor" />
      <path d={mediaPaths.p3c72e200} fill="currentColor" />
      <path d={mediaPaths.p38a44d00} fill="currentColor" />
      <path d={mediaPaths.p16b3f700} fill="currentColor" />
      <path d={mediaPaths.pa113880} fill="currentColor" />
      <path clipRule="evenodd" d={mediaPaths.p17fda300} fill="currentColor" fillRule="evenodd" />
      <path clipRule="evenodd" d={mediaPaths.p18c3f580} fill={starColor || '#FF5E0E'} fillRule="evenodd" />
      <path d={mediaPaths.p2c305600} fill="currentColor" />
      <path d={mediaPaths.p197a2cc0} fill="currentColor" />
      <path d={mediaPaths.p3a45d80} fill="currentColor" />
      <path d={mediaPaths.p1dda4900} fill="currentColor" />
      <path d={mediaPaths.pe408680} fill="currentColor" />
    </svg>
  );
}

/* ── Convenience map ── */

const LOGO_MAP: Record<PanelId, React.FC<LogoProps>> = {
  help: PracticumHelpLogo,
  school: PracticumSchoolLogo,
  media: PracticumMediaLogo,
};

export function PracticumLogo({ id, ...props }: LogoProps & { id: PanelId }) {
  const Logo = LOGO_MAP[id];
  return <Logo {...props} />;
}

/* ── GROUP (preloader logo) ── */
export function PracticumGroupLogo({ height = 32, className, style, starColor }: LogoProps) {
  return (
    <svg
      className={className}
      style={{ height, width: 'auto', display: 'block', ...style }}
      viewBox="0 0 282.876 58.2"
      fill="none"
    >
      <path d={groupPaths.p3fc7a600} fill="currentColor" />
      <path clipRule="evenodd" d={groupPaths.pe03e000} fill="currentColor" fillRule="evenodd" />
      <path clipRule="evenodd" d={groupPaths.p2256cd00} fill="currentColor" fillRule="evenodd" />
      <path clipRule="evenodd" d={groupPaths.p5a62180} fill={starColor || '#57B745'} fillRule="evenodd" />
      <path d={groupPaths.p26983200} fill="currentColor" />
      <path d={groupPaths.p8c6f080} fill="currentColor" />
      <path d={groupPaths.p12952c00} fill="currentColor" />
      <path d={groupPaths.p3b2f5000} fill="currentColor" />
      <path d={groupPaths.p92d1d00} fill="currentColor" />
      <path d={groupPaths.p1b7efe00} fill="currentColor" />
      <path d={groupPaths.p427a7f0} fill="currentColor" />
      <path d={groupPaths.p293e1a80} fill="currentColor" />
      <path d={groupPaths.p3553e00} fill="currentColor" />
      <path d={groupPaths.p2e24e5c0} fill="currentColor" />
      <path d={groupPaths.p3b485e00} fill="currentColor" />
    </svg>
  );
}