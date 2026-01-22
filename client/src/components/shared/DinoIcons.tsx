/**
 * 🦕 Dino-Themed Custom SVG Icons
 * Modern, minimalist icons with prehistoric inspiration
 */

export interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// ========================================
// NAVIGATION ICONS
// ========================================

/**
 * Dino Footprint Icon - Home/Landing
 */
export const DinoFootprint = ({
  size = 24,
  className = "",
  color = "currentColor",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8 14C8 14 9 16 10 17C10.5 17.5 11 18 12 18C13 18 13.5 17.5 14 17C15 16 16 14 16 14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <ellipse cx="7" cy="11" rx="1.5" ry="2" fill={color} />
    <ellipse cx="10" cy="9.5" rx="1.5" ry="2" fill={color} />
    <ellipse cx="14" cy="9.5" rx="1.5" ry="2" fill={color} />
    <ellipse cx="17" cy="11" rx="1.5" ry="2" fill={color} />
  </svg>
);

/**
 * Fern Leaf Icon - Quiz/Learning
 */
export const FernLeaf = ({
  size = 24,
  className = "",
  color = "currentColor",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 4V20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path
      d="M12 6C12 6 14 7 16 8C17 8.5 17.5 9 17.5 10"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 6C12 6 10 7 8 8C7 8.5 6.5 9 6.5 10"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 10C12 10 14 10.5 16 11.5C17 12 17.5 12.5 17.5 13.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 10C12 10 10 10.5 8 11.5C7 12 6.5 12.5 6.5 13.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 14C12 14 13.5 14 15 15C16 15.5 16.5 16 16.5 17"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 14C12 14 10.5 14 9 15C8 15.5 7.5 16 7.5 17"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Fossil Gear Icon - Settings
 */
export const FossilGear = ({
  size = 24,
  className = "",
  color = "currentColor",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
    <path
      d="M12 2L13.5 5.5L17 4L16 7.5L19.5 8.5L17 11L19.5 13.5L16 14.5L17 18L13.5 16.5L12 20L10.5 16.5L7 18L8 14.5L4.5 13.5L7 11L4.5 8.5L8 7.5L7 4L10.5 5.5L12 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Mountain Strata Icon - Dashboard
 */
export const MountainStrata = ({
  size = 24,
  className = "",
  color = "currentColor",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M3 20H21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M4 20L8 12L12 16L16 8L20 14L21 20H3Z" fill={color} opacity="0.2" />
    <path
      d="M4 20L8 12L12 16L16 8L20 14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 17H21"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.5"
    />
    <path
      d="M3 14H21"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.3"
    />
  </svg>
);

/**
 * Dino Egg Achievement Icon
 */
export const DinoEgg = ({
  size = 24,
  className = "",
  color = "currentColor",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 4C9 4 7 6.5 7 9.5V14.5C7 17.5 9 20 12 20C15 20 17 17.5 17 14.5V9.5C17 6.5 15 4 12 4Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 9L12 12L10 10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9.5" cy="15" r="0.5" fill={color} />
    <circle cx="11" cy="16.5" r="0.5" fill={color} />
    <circle cx="13" cy="16.5" r="0.5" fill={color} />
    <circle cx="14.5" cy="15" r="0.5" fill={color} />
  </svg>
);

// ========================================
// ACTION ICONS
// ========================================

/**
 * Dino Claw Play Icon - Start Quiz
 */
export const DinoClawPlay = ({
  size = 24,
  className = "",
  color = "currentColor",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8 5.5V18.5L18 12L8 5.5Z"
      fill={color}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 12L19 10C19.5 9 19.5 8.5 19 8L18 7"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M18 12L19 14C19.5 15 19.5 15.5 19 16L18 17"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Leaf Check Icon - Submit
 */
export const LeafCheck = ({
  size = 24,
  className = "",
  color = "currentColor",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20 6C20 6 13 4 8 9C4 13 4 18 6 20C8 22 13 22 17 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 11C10 11 14 10 17 13"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M9 15L11 17L16 12"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Spike Tail Retry Icon
 */
export const SpikeTailRetry = ({
  size = 24,
  className = "",
  color = "currentColor",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M4 12C4 7.5 7.5 4 12 4C16.5 4 20 7.5 20 12C20 16.5 16.5 20 12 20C9 20 6.5 18.5 5 16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 20L5 16L9 16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M20 12L21 10L22 12L21 14L20 12Z" fill={color} />
    <path d="M18 8L19 6L20 8L19 10L18 8Z" fill={color} />
    <path d="M18 16L19 14L20 16L19 18L18 16Z" fill={color} />
  </svg>
);

// ========================================
// STATUS ICONS
// ========================================

/**
 * Shield Leaf Correct Icon
 */
export const ShieldLeafCorrect = ({
  size = 24,
  className = "",
  color = "currentColor",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 3L4 7V11C4 15.5 7 19.5 12 21C17 19.5 20 15.5 20 11V7L12 3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12L11 14L15 9"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 9C15 9 16 8 17 9"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

/**
 * Crossed Ferns Wrong Icon
 */
export const CrossedFernsWrong = ({
  size = 24,
  className = "",
  color = "currentColor",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <path
      d="M9 9L15 15"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M15 9L9 15"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M8 8C8 8 7 7 6 8"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.5"
    />
    <path
      d="M16 8C16 8 17 7 18 8"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

/**
 * Fossil Lock Icon
 */
export const FossilLock = ({
  size = 24,
  className = "",
  color = "currentColor",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="5"
      y="11"
      width="14"
      height="10"
      rx="2"
      stroke={color}
      strokeWidth="2"
    />
    <path
      d="M7 11V8C7 5.5 9 3 12 3C15 3 17 5.5 17 8V11"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="16" r="1.5" fill={color} />
    <path
      d="M15 8C15.5 7.5 16 7.5 16.5 8"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.5"
    />
    <path
      d="M8.5 8C9 7.5 9.5 7.5 10 8"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

// ========================================
// EXPORT ICON MAP
// ========================================

export const DinoIcons = {
  footprint: DinoFootprint,
  fernLeaf: FernLeaf,
  fossilGear: FossilGear,
  mountainStrata: MountainStrata,
  dinoEgg: DinoEgg,
  clawPlay: DinoClawPlay,
  leafCheck: LeafCheck,
  spikeTailRetry: SpikeTailRetry,
  shieldLeafCorrect: ShieldLeafCorrect,
  crossedFernsWrong: CrossedFernsWrong,
  fossilLock: FossilLock,
} as const;

export type DinoIconName = keyof typeof DinoIcons;

// ========================================
// UNIFIED ICON COMPONENT
// ========================================

interface DinoIconProps extends IconProps {
  name: DinoIconName;
}

export const DinoIcon = ({ name, ...props }: DinoIconProps) => {
  const Icon = DinoIcons[name];
  return <Icon {...props} />;
};

export default DinoIcon;
