import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function InstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // Detect platform
        const ua = window.navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(ua);
        const isAndroid = /android/.test(ua);

        if (isIOS) setPlatform('ios');
        else if (isAndroid) setPlatform('android');

        // Check if already in standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

        if (!isStandalone) {
            // Small delay to not annoy user immediately
            const timer = setTimeout(() => setShowPrompt(true), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setPlatform('android');
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (platform === 'android' && deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowPrompt(false);
            }
            setDeferredPrompt(null);
        } else if (platform === 'ios') {
            // For iOS we just show the instructions which are already in the UI when showPrompt is true
        }
    };

    if (!showPrompt || platform === 'other') return null;

    return (
        <div className="fixed bottom-6 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass-panel p-5 bg-slate-900/95 border-emerald-500/30 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>

                <button
                    onClick={() => setShowPrompt(false)}
                    className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 transition-colors"
                >
                    <X size={18} />
                </button>

                <div className="flex gap-4 items-start">
                    <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 shrink-0">
                        <Download size={24} />
                    </div>

                    <div className="flex-1 pr-4">
                        <h3 className="text-slate-100 font-bold text-sm">Hayırlı İftarlar'ı Uygulama Olarak Ekle</h3>
                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                            Vakitleri kaçırmamak için ana ekranına ekle ve hızlıca eriş.
                        </p>

                        {platform === 'android' ? (
                            <button
                                onClick={handleInstallClick}
                                className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
                            >
                                Hemen Yükle
                            </button>
                        ) : (
                            <div className="mt-4 space-y-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                                <div className="flex items-center gap-3 text-[11px] text-slate-300">
                                    <div className="bg-slate-800 p-1.5 rounded-lg text-blue-400">
                                        <Share size={14} />
                                    </div>
                                    <span>1. Alttaki <strong>"Paylaş"</strong> düğmesine dokun.</span>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-slate-300">
                                    <div className="bg-slate-800 p-1.5 rounded-lg text-slate-100">
                                        <PlusSquare size={14} />
                                    </div>
                                    <span>2. <strong>"Ana Ekrana Ekle"</strong> seçeneğini seç.</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
