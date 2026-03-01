import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface InstallPromptProps {
    manualOpen?: boolean;
    onClose?: () => void;
}

export function InstallPrompt({ manualOpen, onClose }: InstallPromptProps) {
    const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // Detect platform
        const ua = window.navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(ua);
        const isAndroid = /android/.test(ua);

        if (isIOS) setPlatform('ios');
        else if (isAndroid) setPlatform('android');
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
                onClose?.();
            }
            setDeferredPrompt(null);
        }
    };

    if (!manualOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="w-full max-w-sm glass-panel p-6 bg-slate-900 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-8 duration-500"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors p-1"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 ring-1 ring-emerald-500/20">
                        <Download size={32} />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-slate-100 font-bold text-lg">Uygulamayı Ekle</h3>
                        <p className="text-slate-400 text-xs leading-relaxed max-w-[240px]">
                            Hayırlı İftarlar'ı ana ekranına ekleyerek vakitlere her an hızlıca ulaşabilirsin.
                        </p>
                    </div>

                    <div className="w-full pt-2">
                        {platform === 'android' ? (
                            <button
                                onClick={handleInstallClick}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
                            >
                                Hemen Yükle
                            </button>
                        ) : platform === 'ios' ? (
                            <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50 text-left">
                                <div className="flex items-center gap-3 text-xs text-slate-300">
                                    <div className="bg-slate-800 p-2 rounded-lg text-blue-400">
                                        <Share size={16} />
                                    </div>
                                    <span>1. Alttaki <strong>"Paylaş"</strong> düğmesine dokun.</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-300">
                                    <div className="bg-slate-800 p-2 rounded-lg text-slate-100">
                                        <PlusSquare size={16} />
                                    </div>
                                    <span>2. <strong>"Ana Ekrana Ekle"</strong> seçeneğini seç.</span>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/50">
                                <p className="text-xs text-slate-400">Bu özellik sadece mobil cihazlarda desteklenmektedir.</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="text-[10px] text-slate-500 hover:text-slate-400 font-bold uppercase tracking-widest pt-2"
                    >
                        Daha Sonra
                    </button>
                </div>
            </div>
        </div>
    );
}
