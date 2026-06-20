"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center px-4"
          >
            <div className="relative w-full max-w-4xl">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute -top-12 right-0 w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
              >
                <X size={18} />
              </button>

              {/* Video embed — using a beautiful ambient restaurant video from YouTube */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1&rel=0&modestbranding=1&controls=1"
                  title="Aliore Café — The Experience"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Caption */}
              <div className="text-center mt-4">
                <p className="text-neutral-400 font-sans text-sm tracking-widest uppercase">
                  Aliore Café — The Experience
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
