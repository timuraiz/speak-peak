'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

export default function SnackBar() {
    const { user, profile } = useAuth();
    const [visible, setVisible] = useState(true);
    const displayName = profile?.name ?? user?.email?.split('@')[0] ?? 'there';

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`flex items-center gap-2 bg-background rounded-2xl px-4 py-3 border border-border w-fit justify-center mx-auto transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <img src="/snack.svg" alt="Snackbar" className="w-5 h-5" />
            <p className="text-xs font-medium text-dark">Welcome to SpeakPeak, {displayName}. You can start speaking</p>
        </div>
    );
}
