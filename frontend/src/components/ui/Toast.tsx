import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast icons and styles
const toastConfig = {
    success: {
        icon: CheckCircle,
        bgClass: 'bg-forest-500/10 dark:bg-forest-500/20',
        borderClass: 'border-forest-500/30',
        iconClass: 'text-forest-600 dark:text-forest-400',
        titleClass: 'text-forest-700 dark:text-forest-300',
    },
    error: {
        icon: XCircle,
        bgClass: 'bg-coral-500/10 dark:bg-coral-500/20',
        borderClass: 'border-coral-500/30',
        iconClass: 'text-coral-600 dark:text-coral-400',
        titleClass: 'text-coral-700 dark:text-coral-300',
    },
    warning: {
        icon: AlertTriangle,
        bgClass: 'bg-amber-500/10 dark:bg-amber-500/20',
        borderClass: 'border-amber-500/30',
        iconClass: 'text-amber-600 dark:text-amber-400',
        titleClass: 'text-amber-700 dark:text-amber-300',
    },
    info: {
        icon: Info,
        bgClass: 'bg-blue-500/10 dark:bg-blue-500/20',
        borderClass: 'border-blue-500/30',
        iconClass: 'text-blue-600 dark:text-blue-400',
        titleClass: 'text-blue-700 dark:text-blue-300',
    },
};

// Single Toast Component
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
    const config = toastConfig[toast.type];
    const Icon = config.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            className={`
                relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-lg max-w-sm
                ${config.bgClass} ${config.borderClass}
            `}
        >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconClass}`} />
            <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${config.titleClass}`}>{toast.title}</p>
                {toast.message && (
                    <p className="text-sm text-muted-foreground mt-1">{toast.message}</p>
                )}
            </div>
            <button
                onClick={onRemove}
                className="p-1 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
            >
                <X className="w-4 h-4 text-muted-foreground" />
            </button>
        </motion.div>
    );
}

// Toast Container Component
export function ToastContainer() {
    const context = useContext(ToastContext);
    if (!context) return null;

    const { toasts, removeToast } = context;

    return (
        <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onRemove={() => removeToast(toast.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

// Toast Provider
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        const duration = toast.duration ?? 4000;

        setToasts((prev) => [...prev, { ...toast, id }]);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
}

// Hook to use toasts
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return {
        toast: context.addToast,
        success: (title: string, message?: string) =>
            context.addToast({ type: 'success', title, message }),
        error: (title: string, message?: string) =>
            context.addToast({ type: 'error', title, message }),
        warning: (title: string, message?: string) =>
            context.addToast({ type: 'warning', title, message }),
        info: (title: string, message?: string) =>
            context.addToast({ type: 'info', title, message }),
    };
}
