//---File ini adalah komponen Toast notification---\\
//---Menampilkan pesan sukses/error/warning/info yang muncul di layar, auto dismiss setelah beberapa detik---\\

'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export function ToastItem({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto close
    const duration = toast.duration || 4000;
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  };

  const icons = {
    success: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const styles = {
    success: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-400',
    error: 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/50 text-red-400',
    warning: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50 text-yellow-400',
    info: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/50 text-blue-400',
  };

  return (
    <div
      className={`
        relative overflow-hidden
        backdrop-blur-xl
        border rounded-2xl
        shadow-2xl
        p-4 pr-12
        min-w-[320px] max-w-md
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        ${styles[toast.type]}
        hover:scale-[1.02] hover:shadow-3xl
      `}
      style={{
        animation: isVisible && !isLeaving ? 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : '',
      }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-50"></div>
      
      {/* Content */}
      <div className="relative flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5 animate-pulse-slow">
          {icons[toast.type]}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold leading-relaxed">{toast.message}</p>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 p-1 rounded-lg hover:bg-white/10 transition-colors duration-200 opacity-70 hover:opacity-100"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 rounded-b-2xl overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${
            toast.type === 'success' ? 'from-green-400 to-emerald-400' :
            toast.type === 'error' ? 'from-red-400 to-rose-400' :
            toast.type === 'warning' ? 'from-yellow-400 to-amber-400' :
            'from-blue-400 to-cyan-400'
          }`}
          style={{
            animation: `progress ${toast.duration || 4000}ms linear forwards`,
          }}
        />
      </div>

      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}

