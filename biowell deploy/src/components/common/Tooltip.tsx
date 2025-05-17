import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const Tooltip = ({
  content,
  children,
  position = 'top',
  delay = 300,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    switch (position) {
      case 'top':
        setCoords({
          x: rect.left + rect.width / 2 + scrollX,
          y: rect.top + scrollY,
        });
        break;
      case 'bottom':
        setCoords({
          x: rect.left + rect.width / 2 + scrollX,
          y: rect.bottom + scrollY,
        });
        break;
      case 'left':
        setCoords({
          x: rect.left + scrollX,
          y: rect.top + rect.height / 2 + scrollY,
        });
        break;
      case 'right':
        setCoords({
          x: rect.right + scrollX,
          y: rect.top + rect.height / 2 + scrollY,
        });
        break;
    }
  };

  const handleMouseEnter = () => {
    updatePosition();
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const variants = {
    top: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 10 },
    },
    bottom: {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
    },
    left: {
      initial: { opacity: 0, x: 10 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 10 },
    },
    right: {
      initial: { opacity: 0, x: -10 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -10 },
    },
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed z-50"
            style={{
              left: position === 'right' ? coords.x + 8 : position === 'left' ? coords.x - 8 : coords.x,
              top: position === 'bottom' ? coords.y + 8 : position === 'top' ? coords.y - 8 : coords.y,
              transform: 'translate(-50%, -50%)',
            }}
            initial={variants[position].initial}
            animate={variants[position].animate}
            exit={variants[position].exit}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Tooltip;