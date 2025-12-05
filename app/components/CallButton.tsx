'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCallContext } from '../(call)/layout';

interface CallButtonProps {
    variant?: 'mute' | 'cancel';
}

export default function CallButton({ variant = 'mute' }: CallButtonProps) {
    const { isMuted, setIsMuted } = useCallContext();
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const router = useRouter();

    const handleClick = () => {
        if (variant === 'mute') {
            setIsMuted(!isMuted);
        } else if (variant === 'cancel') {
            router.push('/');
        }
    };

    const handleMouseDown = () => {
        if (variant === 'cancel') {
            setIsPressed(true);
        }
    };

    const handleMouseUp = () => {
        if (variant === 'cancel') {
            setIsPressed(false);
        }
    };

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
        <div
            className="border border-border rounded-full cursor-pointer flex items-center justify-center w-12 h-12"
            style={{ backgroundColor: getBackgroundColor() }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsPressed(false);
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <img src={getIconSrc()} alt={getAltText()} className="w-5 h-5" />
        </div>
    );
}
