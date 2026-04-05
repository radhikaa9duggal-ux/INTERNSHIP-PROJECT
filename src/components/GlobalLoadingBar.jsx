import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * GlobalLoadingBar — renders a slim gold progress bar at the absolute top 
 * of the viewport whenever `loading` is true.
 * 
 * Design trick: We animate to 85% quickly, then animate to 100% and fade out
 * seamlessly so it never appears "stuck." 
 */
export default function GlobalLoadingBar({ loading }) {
  const [visible, setVisible] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (loading) {
      setComplete(false);
      setVisible(true);
    } else {
      // Flash to 100% then fade
      setComplete(true);
      const t = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(t);
    }
  }, [loading]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-transparent overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#f5d06b] to-[#D4AF37] rounded-full"
            initial={{ width: '0%', x: '-100%' }}
            animate={
              complete
                ? { width: '100%', x: '0%' }
                : { width: '85%', x: '0%' }
            }
            transition={
              complete
                ? { duration: 0.3, ease: 'easeOut' }
                : { duration: 1.8, ease: [0.4, 0, 0.2, 1] }
            }
          />
          {/* Glow pulse */}
          {!complete && (
            <motion.div
              className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#D4AF37]/80 to-transparent blur-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
