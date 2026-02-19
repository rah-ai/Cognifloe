import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Bell, Palette, Moon, Sun, Save, CheckCircle2, AlertTriangle, Monitor, Shield, Zap, LogOut } from "lucide-react"
import { GlassCard } from "../components/ui/GlassCard"
import { Button3D } from "../components/ui/Button3D"
import { useTheme } from "../context/ThemeContext"

interface SettingsState {
    // Account
    fullName: string
    email: string
    avatar: string

    // Notifications
    emailNotifications: boolean
    pushNotifications: boolean
    digestFrequency: 'daily' | 'weekly' | 'monthly'

    // Security
    twoFactorEnabled: boolean
    dataEncryption: boolean

    // Appearance
    theme: 'light' | 'dark' | 'system'
    colorScheme: string
    density: 'compact' | 'comfortable'

    // General
    language: string
    timezone: string
}

interface UserInfo {
    name: string;
    email: string;
}

function getUserFromToken(): UserInfo {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { name: "Guest User", email: "guest@cognifloe.ai" };
        }

        // Decode JWT token (base64)
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));

        const fullName = decoded.full_name || decoded.name || decoded.email?.split('@')[0] || "User";
        const email = decoded.email || "user@cognifloe.ai";

        return { name: fullName, email };
    } catch {
        return { name: "User", email: "user@cognifloe.ai" };
    }
}

function getDefaultSettings(): SettingsState {
    const user = getUserFromToken();
    return {
        fullName: user.name,
        email: user.email,
        avatar: '',
        emailNotifications: true,
        pushNotifications: true,
        digestFrequency: 'daily',
        twoFactorEnabled: false,
        dataEncryption: true,
        theme: 'dark',
        colorScheme: '#F97316',
        density: 'comfortable',
        language: 'en-US',
        timezone: 'UTC'
    };
}

// Toggle Switch Component
function ToggleSwitch({ enabled, onChange, color = "primary" }: { enabled: boolean; onChange: () => void; color?: string }) {
    return (
        <button
            onClick={onChange}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${enabled
                ? color === "primary" ? 'bg-gradient-to-r from-sunset-500 to-coral-500' : 'bg-gradient-to-r from-forest-500 to-emerald-500'
                : 'bg-muted/30 border border-border'
                }`}
        >
            <motion.div
                animate={{ x: enabled ? 28 : 4 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        </button>
    );
}

export default function Settings() {
    const { theme: currentTheme, setTheme } = useTheme();
    const [settings, setSettings] = useState<SettingsState>(getDefaultSettings())
    const [saved, setSaved] = useState(false)

    // Load settings from localStorage on mount, but preserve user info from token
    useEffect(() => {
        const savedSettings = localStorage.getItem('cognifloe_settings')
        const userInfo = getUserFromToken();

        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                // Always use fresh user info from token for name and email
                setSettings({
                    ...parsed,
                    fullName: userInfo.name,
                    email: userInfo.email
                });
            } catch (e) {
                console.error("Failed to parse settings", e)
            }
        } else {
            // No saved settings, use defaults with user info
            setSettings(prev => ({
                ...prev,
                fullName: userInfo.name,
                email: userInfo.email
            }));
        }
    }, [])

    // Save settings to localStorage
    const saveSettings = () => {
        localStorage.setItem('cognifloe_settings', JSON.stringify(settings))
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    // Update a setting
    const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    // Toggle boolean settings
    const toggleSetting = (key: keyof SettingsState) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key as keyof SettingsState] }))
    }

    // Handle theme change
    const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
        updateSetting('theme', theme);
        setTheme(theme);
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sunset-500/10 border border-sunset-500/20 mb-4">
                    <Zap className="w-4 h-4 text-sunset-500" />
                    <span className="text-sm font-medium text-sunset-600 dark:text-sunset-400">Workspace Settings</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sunset-500 via-primary to-secondary mb-4 pb-1 font-display">
                    Settings
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Manage your account preferences, notifications, and appearance settings.
                </p>
            </motion.div>

            {/* Quick Save Bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-end"
            >
                <Button3D
                    onClick={saveSettings}
                    variant={saved ? "success" : "organic"}
                    leftIcon={saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                >
                    {saved ? "Saved!" : "Save All Changes"}
                </Button3D>
            </motion.div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <GlassCard className="p-6 h-full">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-sunset-500/20 to-coral-500/20">
                                <User className="w-5 h-5 text-sunset-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Account</h3>
                                <p className="text-xs text-muted-foreground">Manage your profile information</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-foreground">Full Name</label>
                                <input
                                    type="text"
                                    value={settings.fullName}
                                    onChange={(e) => updateSetting('fullName', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border/50 focus:border-sunset-500/50 focus:ring-2 focus:ring-sunset-500/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-foreground">Email Address</label>
                                <input
                                    type="email"
                                    value={settings.email}
                                    onChange={(e) => updateSetting('email', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border/50 focus:border-sunset-500/50 focus:ring-2 focus:ring-sunset-500/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Sign Out Button */}
                            <div className="pt-4 border-t border-border/50">
                                <Button3D
                                    variant="outline"
                                    className="w-full border-sunset-500/50 text-sunset-600 dark:text-sunset-400 hover:bg-sunset-500/10"
                                    leftIcon={<LogOut className="w-4 h-4" />}
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        localStorage.removeItem('cognifloe_settings');
                                        window.location.href = '/';
                                    }}
                                >
                                    Sign Out
                                </Button3D>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Appearance Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <GlassCard className="p-6 h-full">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                                <Palette className="w-5 h-5 text-violet-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Appearance</h3>
                                <p className="text-xs text-muted-foreground">Customize your visual experience</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-3 text-foreground">Theme Mode</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'light' as const, icon: Sun, label: 'Light' },
                                        { value: 'dark' as const, icon: Moon, label: 'Dark' },
                                        { value: 'system' as const, icon: Monitor, label: 'System' }
                                    ].map((theme) => (
                                        <button
                                            key={theme.value}
                                            onClick={() => handleThemeChange(theme.value)}
                                            className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${currentTheme === theme.value
                                                ? 'border-sunset-500 bg-sunset-500/10 text-sunset-500'
                                                : 'border-border/50 bg-background/40 hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            <theme.icon className="w-5 h-5" />
                                            <span className="text-sm font-medium">{theme.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Notifications Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <GlassCard className="p-6 h-full">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                                <Bell className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Notifications</h3>
                                <p className="text-xs text-muted-foreground">Configure alert preferences</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/30">
                                <div>
                                    <p className="font-medium text-foreground">Email Notifications</p>
                                    <p className="text-xs text-muted-foreground">Receive workflow updates via email</p>
                                </div>
                                <ToggleSwitch
                                    enabled={settings.emailNotifications}
                                    onChange={() => toggleSetting('emailNotifications')}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/30">
                                <div>
                                    <p className="font-medium text-foreground">Push Notifications</p>
                                    <p className="text-xs text-muted-foreground">Real-time agent status updates</p>
                                </div>
                                <ToggleSwitch
                                    enabled={settings.pushNotifications}
                                    onChange={() => toggleSetting('pushNotifications')}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/30">
                                <div>
                                    <p className="font-medium text-foreground">Digest Frequency</p>
                                    <p className="text-xs text-muted-foreground">Summary email schedule</p>
                                </div>
                                <select
                                    value={settings.digestFrequency}
                                    onChange={(e) => updateSetting('digestFrequency', e.target.value as 'daily' | 'weekly' | 'monthly')}
                                    className="px-3 py-2 rounded-lg bg-background border border-border/50 text-sm text-foreground focus:border-sunset-500/50 focus:ring-1 focus:ring-sunset-500/20 outline-none"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Security Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <GlassCard className="p-6 h-full">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20">
                                <Shield className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Security</h3>
                                <p className="text-xs text-muted-foreground">Protect your account</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/30">
                                <div>
                                    <p className="font-medium text-foreground">Two-Factor Auth</p>
                                    <p className="text-xs text-muted-foreground">Add extra security layer</p>
                                </div>
                                <ToggleSwitch
                                    enabled={settings.twoFactorEnabled}
                                    onChange={() => toggleSetting('twoFactorEnabled')}
                                    color="secondary"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/30">
                                <div>
                                    <p className="font-medium text-foreground">Data Encryption</p>
                                    <p className="text-xs text-muted-foreground">End-to-end encryption</p>
                                </div>
                                <ToggleSwitch
                                    enabled={settings.dataEncryption}
                                    onChange={() => toggleSetting('dataEncryption')}
                                    color="secondary"
                                />
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <GlassCard className="p-6 border-rose-500/20">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-rose-500/20">
                        <div className="p-2.5 rounded-xl bg-rose-500/10">
                            <AlertTriangle className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-rose-500">Danger Zone</h3>
                            <p className="text-xs text-rose-400/70">Irreversible actions</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                        <div>
                            <p className="font-medium text-rose-400">Delete Account</p>
                            <p className="text-xs text-rose-400/70">Permanently remove your account and all data</p>
                        </div>
                        <Button3D
                            variant="outline"
                            size="sm"
                            className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                            onClick={() => {
                                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                    localStorage.clear()
                                    window.location.href = '/login'
                                }
                            }}
                        >
                            Delete Account
                        </Button3D>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    )
}
