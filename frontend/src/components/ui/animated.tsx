"use client";

import { motion, Variants, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

// FadeIn wrapper component
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.4,
  className,
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// SlideIn component (from left/right/top/bottom)
interface SlideInProps {
  children: ReactNode;
  direction?: "left" | "right" | "top" | "bottom";
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export function SlideIn({
  children,
  direction = "bottom",
  delay = 0,
  duration = 0.5,
  distance = 20,
  className,
}: SlideInProps) {
  const directionOffset = {
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    top: { x: 0, y: -distance },
    bottom: { x: 0, y: distance },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directionOffset[direction],
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth motion
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger children animation wrapper
interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (staggerDelay: number) => ({
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
    },
  }),
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  initialDelay = 0,
  className,
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={staggerDelay}
      transition={{ delay: initialDelay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

// Scale on hover component
interface ScaleOnHoverProps {
  children: ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
}

export function ScaleOnHover({
  children,
  scale = 1.02,
  duration = 0.2,
  className,
}: ScaleOnHoverProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Page transition wrapper
interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Smooth height animation wrapper
interface AnimatedHeightProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedHeight({ children, className }: AnimatedHeightProps) {
  return (
    <motion.div
      initial={false}
      animate={{ height: "auto" }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Pulse animation for notifications/badges
interface PulseProps {
  children: ReactNode;
  className?: string;
}

export function Pulse({ children, className }: PulseProps) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Skeleton shimmer effect
interface SkeletonShimmerProps {
  className?: string;
}

export function SkeletonShimmer({ className }: SkeletonShimmerProps) {
  return (
    <motion.div
      className={className}
      animate={{
        backgroundPosition: ["200% 0", "-200% 0"],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent, rgba(56,189,248,0.25), transparent)",
        backgroundSize: "200% 100%",
      }}
    />
  );
}

// ============================================
// NEW GLASS & GALACTIC ANIMATION PRIMITIVES
// ============================================

// Glow pulse effect for active/processing states
interface GlowPulseProps {
  children: ReactNode;
  color?: "sky" | "emerald" | "amber" | "green" | "blue";
  intensity?: "subtle" | "medium" | "strong";
  className?: string;
}

const glowColors = {
  sky: "rgba(56, 189, 248, VAR)",
  emerald: "rgba(52, 211, 153, VAR)",
  blue: "rgba(59, 130, 246, VAR)",
  green: "rgba(34, 197, 94, VAR)",
  amber: "rgba(245, 158, 11, VAR)",
};

const glowIntensities = {
  subtle: { min: 0.15, max: 0.3, blur: 15 },
  medium: { min: 0.25, max: 0.5, blur: 25 },
  strong: { min: 0.4, max: 0.7, blur: 40 },
};

export function GlowPulse({
  children,
  color = "sky",
  intensity = "medium",
  className,
}: GlowPulseProps) {
  const { min, max, blur } = glowIntensities[intensity];
  const colorBase = glowColors[color];

  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          `0 0 ${blur}px ${colorBase.replace("VAR", String(min))}`,
          `0 0 ${blur * 1.5}px ${colorBase.replace("VAR", String(max))}`,
          `0 0 ${blur}px ${colorBase.replace("VAR", String(min))}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// Slide up animation for list item additions/removals
interface SlideUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function SlideUp({
  children,
  delay = 0,
  duration = 0.3,
  className,
}: SlideUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Scale in for modal/popover entrances
interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  origin?: "center" | "top" | "bottom" | "left" | "right";
  className?: string;
}

const originMap = {
  center: { transformOrigin: "center center" },
  top: { transformOrigin: "top center" },
  bottom: { transformOrigin: "bottom center" },
  left: { transformOrigin: "center left" },
  right: { transformOrigin: "center right" },
};

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.2,
  origin = "center",
  className,
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={originMap[origin]}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Enhanced shimmer for loading states with light gradient
interface NeonShimmerProps {
  className?: string;
  color?: "sky" | "emerald" | "blue";
}

const shimmerGradients = {
  sky: "linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.3), transparent)",
  emerald: "linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.3), transparent)",
  blue: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)",
};

export function NeonShimmer({ className, color = "sky" }: NeonShimmerProps) {
  return (
    <motion.div
      className={className}
      animate={{
        backgroundPosition: ["-200% 0", "200% 0"],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundImage: shimmerGradients[color],
        backgroundSize: "200% 100%",
      }}
    />
  );
}

// Stagger list for table rows with index-aware delays
interface StaggerListProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function StaggerList({ children, className }: StaggerListProps) {
  return (
    <motion.div
      variants={listContainerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerListItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={listItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

// Animated counter for numbers
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  formatter?: (value: number) => string;
}

export function AnimatedCounter({
  value,
  duration = 1,
  className,
  formatter = (v) => Math.round(v).toLocaleString(),
}: AnimatedCounterProps) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000 });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(formatter(latest));
    });
    return unsubscribe;
  }, [springValue, formatter]);

  return <span className={className}>{displayValue}</span>;
}

// Hover lift effect with glow
interface HoverLiftProps {
  children: ReactNode;
  className?: string;
  glowColor?: "sky" | "emerald" | "blue";
}

export function HoverLift({
  children,
  className,
  glowColor = "sky",
}: HoverLiftProps) {
  const glowBase = glowColors[glowColor];

  return (
    <motion.div
      className={className}
      whileHover={{
        y: -4,
        boxShadow: `0 20px 40px ${glowBase.replace("VAR", "0.15")}, 0 0 30px ${glowBase.replace("VAR", "0.1")}`,
      }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Presence wrapper for enter/exit animations
interface PresenceProps {
  children: ReactNode;
  show: boolean;
  mode?: "sync" | "wait" | "popLayout";
}

export function Presence({ children, show, mode = "sync" }: PresenceProps) {
  return (
    <AnimatePresence mode={mode}>
      {show && children}
    </AnimatePresence>
  );
}

// Ripple effect on click
interface RippleProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

export function Ripple({ children, className, color = "rgba(56, 189, 248, 0.3)" }: RippleProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={handleClick}>
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: ripple.x,
              top: ripple.y,
              width: 20,
              height: 20,
              marginLeft: -10,
              marginTop: -10,
              borderRadius: "50%",
              backgroundColor: color,
              pointerEvents: "none",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Magnetic hover effect
interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function Magnetic({ children, className, strength = 0.3 }: MagneticProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  return (
    <motion.div
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

// Typewriter text effect
interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

export function Typewriter({ text, className, speed = 50, delay = 0 }: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const startTyping = () => {
      let index = 0;
      const type = () => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
          timeout = setTimeout(type, speed);
        }
      };
      type();
    };

    const delayTimeout = setTimeout(startTyping, delay);
    return () => {
      clearTimeout(delayTimeout);
      clearTimeout(timeout);
    };
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        |
      </motion.span>
    </span>
  );
}
