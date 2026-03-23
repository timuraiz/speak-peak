'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

export default function SnackBar() {
    const { user, profile } = useAuth();
    const [mounted, setMounted] = useState(() => {
        if (typeof window === 'undefined') return false;
        if (new URLSearchParams(window.location.search).get('welcome') === '1') return true;
        const show = sessionStorage.getItem('showWelcome') === '1';
        if (show) sessionStorage.removeItem('showWelcome');
        return show;
    });
    const [show, setShow] = useState(false);
    const displayName = profile?.name ?? user?.email?.split('@')[0] ?? 'there';

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('welcome') === '1') {
            const url = new URL(window.location.href);
            url.searchParams.delete('welcome');
            history.replaceState(null, '', url.toString());
        }
    }, []);

    // Trigger enter animation after mount
    useEffect(() => {
        if (!mounted) return;
        const enterTimer = setTimeout(() => setShow(true), 10);
        return () => clearTimeout(enterTimer);
    }, [mounted]);

    // Auto-dismiss
    useEffect(() => {
        if (!show) return;
        const hideTimer = setTimeout(() => {
            setShow(false);
            setTimeout(() => setMounted(false), 400);
        }, 3000);
        return () => clearTimeout(hideTimer);
    }, [show]);

    if (!mounted) return null;

    return (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-background rounded-2xl px-4 py-3 border border-border w-fit shadow-sm transition-all duration-400 ease-in-out ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
            <img src="/snack.svg" alt="Snackbar" className="w-5 h-5" />
            <p className="text-xs font-medium text-dark whitespace-nowrap">Welcome to SpeakPeak, {displayName}. You can start speaking</p>
        </div>
    );
}
