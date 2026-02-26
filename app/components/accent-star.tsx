import svgPaths from '../../imports/svg-ecqlp2voje';

interface AccentStarProps {
  color: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AccentStar({ color, size = 12, className = '', style }: AccentStarProps) {
  return (
    <svg
      className={`block flex-shrink-0 ${className}`}
      width={size}
      height={size * (27.2119 / 29.129)}
      viewBox="0 0 29.129 27.2119"
      fill="none"
      style={style}
    >
      <path
        d={svgPaths.p1c4cef00}
        fill={color}
        clipRule="evenodd"
        fillRule="evenodd"
      />
    </svg>
  );
}
