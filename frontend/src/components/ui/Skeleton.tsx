import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'card';
    width?: string | number;
    height?: string | number;
    lines?: number;
}

// Base skeleton with shimmer animation
export function SkeletonBase({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement> & { className?: string }) {
    return (
        <div
            className={`
                relative overflow-hidden bg-muted/60 dark:bg-muted/40 rounded-lg
                before:absolute before:inset-0 
                before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
                before:animate-shimmer
                ${className}
            `}
            {...props}
        />
    );
}

// Main Skeleton Component
export function Skeleton({
    className = '',
    variant = 'rectangular',
    width,
    height,
    lines = 1
}: SkeletonProps) {
    const style: React.CSSProperties = {
        width: width ?? (variant === 'text' ? '100%' : undefined),
        height: height ?? (variant === 'text' ? '1rem' : variant === 'circular' ? width : undefined),
    };

    if (variant === 'text' && lines > 1) {
        return (
            <div className={`space-y-2 ${className}`}>
                {Array.from({ length: lines }).map((_, i) => (
                    <SkeletonBase
                        key={i}
                        className="h-4 rounded"
                        style={{ width: i === lines - 1 ? '75%' : '100%' }}
                    />
                ))}
            </div>
        );
    }

    if (variant === 'circular') {
        return (
            <SkeletonBase
                className={`rounded-full ${className}`}
                style={{ ...style, aspectRatio: '1' }}
            />
        );
    }

    return <SkeletonBase className={className} style={style} />;
}

// Pre-built skeleton patterns
export function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-6 rounded-2xl border border-border bg-card ${className}`}
        >
            <div className="flex items-center gap-4 mb-4">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="h-4 w-1/2" />
                    <Skeleton variant="text" className="h-3 w-1/3" />
                </div>
            </div>
            <Skeleton variant="text" lines={3} />
        </motion.div>
    );
}

export function SkeletonAgent({ className = '' }: { className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-5 rounded-2xl border border-border bg-card ${className}`}
        >
            <div className="flex items-start justify-between mb-4">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton variant="text" className="h-5 w-3/4 mb-2" />
            <Skeleton variant="text" lines={2} className="mb-4" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
        </motion.div>
    );
}

export function SkeletonChart({ className = '' }: { className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-6 rounded-2xl border border-border bg-card ${className}`}
        >
            <Skeleton variant="text" className="h-6 w-1/3 mb-4" />
            <div className="flex items-end gap-2 h-48">
                {[40, 65, 50, 80, 55, 70, 45].map((h, i) => (
                    <SkeletonBase
                        key={i}
                        className="flex-1 rounded-t-lg"
                        style={{ height: `${h}%` }}
                    />
                ))}
            </div>
        </motion.div>
    );
}

export function SkeletonTable({ rows = 5, className = '' }: { rows?: number; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`rounded-2xl border border-border bg-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-4 border-b border-border bg-muted/30 flex gap-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="p-4 border-b border-border last:border-0 flex gap-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            ))}
        </motion.div>
    );
}

export function SkeletonDashboard() {
    return (
        <div className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-5 rounded-2xl border border-border bg-card"
                    >
                        <Skeleton className="h-4 w-1/2 mb-3" />
                        <Skeleton className="h-8 w-1/3 mb-2" />
                        <Skeleton className="h-3 w-2/3" />
                    </motion.div>
                ))}
            </div>
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonChart />
                <SkeletonChart />
            </div>
        </div>
    );
}
