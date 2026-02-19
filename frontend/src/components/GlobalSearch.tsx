import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Command,
    X,
    LayoutDashboard,
    Workflow,
    Bot,
    BarChart3,
    Brain,
    Eye,
    Settings,
    Zap,
    FileText,
    ArrowRight
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SearchItem {
    id: string;
    type: 'page' | 'agent' | 'action';
    title: string;
    description?: string;
    icon: LucideIcon;
    path?: string;
    action?: () => void;
    keywords?: string[];
}

// Predefined search items
const searchItems: SearchItem[] = [
    // Pages
    { id: 'dashboard', type: 'page', title: 'Dashboard', description: 'Overview and statistics', icon: LayoutDashboard, path: '/dashboard', keywords: ['home', 'overview', 'stats'] },
    { id: 'workflow', type: 'page', title: 'Workflow Input', description: 'Create new workflows', icon: Workflow, path: '/dashboard/input', keywords: ['create', 'new', 'workflow'] },
    { id: 'agents', type: 'page', title: 'Agent Architectures', description: 'View agent connections', icon: Bot, path: '/dashboard/agents', keywords: ['agents', 'architecture', 'connections'] },
    { id: 'catalog', type: 'page', title: 'Agent Catalog', description: 'Browse all AI agents', icon: Zap, path: '/dashboard/catalog', keywords: ['browse', 'agents', 'marketplace'] },
    { id: 'metrics', type: 'page', title: 'Metrics', description: 'Performance analytics', icon: BarChart3, path: '/dashboard/metrics', keywords: ['analytics', 'performance', 'stats'] },
    { id: 'predictions', type: 'page', title: 'AI Predictions', description: 'ML-powered insights', icon: Brain, path: '/dashboard/ml-predictions', keywords: ['ai', 'ml', 'predictions', 'forecast'] },
    { id: 'shadow', type: 'page', title: 'Shadow Mode', description: 'Review agent decisions', icon: Eye, path: '/dashboard/shadow-mode', keywords: ['review', 'approve', 'decisions'] },
    { id: 'settings', type: 'page', title: 'Settings', description: 'Configure preferences', icon: Settings, path: '/dashboard/settings', keywords: ['config', 'preferences', 'account'] },
    // Actions
    { id: 'new-workflow', type: 'action', title: 'Create New Workflow', description: 'Start building a new automation', icon: FileText, path: '/dashboard/input', keywords: ['new', 'create', 'workflow'] },
];

export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();

    // Filter results
    const filteredItems = useMemo(() => {
        if (!query.trim()) return searchItems.slice(0, 6);

        const lowerQuery = query.toLowerCase();
        return searchItems.filter(item =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.description?.toLowerCase().includes(lowerQuery) ||
            item.keywords?.some(k => k.includes(lowerQuery))
        );
    }, [query]);

    // Keyboard shortcut to open
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd+K or Ctrl+K
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            // Escape to close
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, filteredItems.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
            handleSelect(filteredItems[selectedIndex]);
        }
    }, [filteredItems, selectedIndex]);

    // Handle selection
    const handleSelect = (item: SearchItem) => {
        setIsOpen(false);
        setQuery('');
        if (item.path) {
            navigate(item.path);
        } else if (item.action) {
            item.action();
        }
    };

    // Reset selected index when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-all group"
            >
                <Search className="w-4 h-4" />
                <span className="text-sm hidden md:inline">Search...</span>
                <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-background border border-border text-xs font-mono">
                    <Command className="w-3 h-3" />K
                </kbd>
            </button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
                        />

                        {/* Search Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-xl"
                        >
                            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                                {/* Search Input */}
                                <div className="flex items-center gap-3 p-4 border-b border-border">
                                    <Search className="w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Search pages, agents, actions..."
                                        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1 rounded-lg hover:bg-muted transition-colors"
                                    >
                                        <X className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                </div>

                                {/* Results */}
                                <div className="max-h-80 overflow-y-auto p-2">
                                    {filteredItems.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground">
                                            No results found for "{query}"
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            {filteredItems.map((item, index) => {
                                                const Icon = item.icon;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => handleSelect(item)}
                                                        onMouseEnter={() => setSelectedIndex(index)}
                                                        className={`
                                                            w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all
                                                            ${selectedIndex === index
                                                                ? 'bg-sunset-500/10 border border-sunset-500/30'
                                                                : 'hover:bg-muted border border-transparent'
                                                            }
                                                        `}
                                                    >
                                                        <div className={`
                                                            p-2 rounded-lg 
                                                            ${selectedIndex === index ? 'bg-sunset-500/20' : 'bg-muted'}
                                                        `}>
                                                            <Icon className={`w-4 h-4 ${selectedIndex === index ? 'text-sunset-500' : 'text-muted-foreground'}`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-foreground truncate">{item.title}</p>
                                                            {item.description && (
                                                                <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                                                            )}
                                                        </div>
                                                        <div className={`
                                                            text-xs px-2 py-0.5 rounded-full
                                                            ${item.type === 'page' ? 'bg-blue-500/10 text-blue-500' :
                                                                item.type === 'agent' ? 'bg-forest-500/10 text-forest-500' :
                                                                    'bg-amber-500/10 text-amber-500'}
                                                        `}>
                                                            {item.type}
                                                        </div>
                                                        {selectedIndex === index && (
                                                            <ArrowRight className="w-4 h-4 text-sunset-500" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="p-3 border-t border-border bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">↑↓</kbd>
                                            Navigate
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">↵</kbd>
                                            Select
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">esc</kbd>
                                            Close
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default GlobalSearch;
