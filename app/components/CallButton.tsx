'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCallContext } from '../(call)/layout';

interface CallButtonProps {
    variant?: 'mute' | 'cancel';
}

export default function CallButton({ variant = 'mute' }: CallButtonProps) {
    const { isMuted, toggleMute } = useCallContext();
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const router = useRouter();

    const handleClick = async () => {
        if (variant === 'mute') {
            toggleMute();
        } else if (variant === 'cancel') {
            const userId = sessionStorage.getItem('userId');
            const startTime = sessionStorage.getItem('callStartTime');
            if (startTime) {
                const duration_seconds = Math.floor((Date.now() - parseInt(startTime)) / 1000);
                if (duration_seconds >= 1) {
                    fetch('/api/sessions/save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ duration_seconds }),
                    });
                }
            }
            if (userId) {
                await fetch('/api/queue/leave', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, roomId: true }),
                });
            }
            sessionStorage.removeItem('isLeader');
            router.push('/');
        }
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    const getIconSrc = () => {
        if (variant === 'cancel') {
            return isPressed ? '/Call/iconsax-close-circle-1.svg' : '/iconsax-close-circle.svg';
        }
        return isMuted ? '/Call/iconsax-microphone-slash-1.svg' : '/Call/iconsax-microphone.svg';
    };

    const getAltText = () => {
        if (variant === 'cancel') {
            return 'Cancel';
        }
        return isMuted ? 'Muted' : 'Mute';
    };

    const getBackgroundColor = () => {
        if (variant === 'cancel') {
            if (isPressed) {
                return 'var(--color-red)';
            }
            return isHovered ? 'var(--color-hover)' : 'var(--background)';
        }
        if (isMuted) {
            return isHovered ? '#E33F45' : 'var(--color-red)';
        }
        return isHovered ? 'var(--color-hover)' : 'var(--background)';
    };

    return (
        <button
            className="border border-border rounded-full cursor-pointer flex items-center justify-center w-12 h-12 transition-transform active:scale-95"
            style={{ backgroundColor: getBackgroundColor() }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <img src={getIconSrc()} alt={getAltText()} className="w-5 h-5" />
        </button>
    );
}
