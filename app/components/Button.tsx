import React from 'react';
import Image from 'next/image';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary';
    size?: 'small' | 'medium' | 'large';
    children: React.ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'medium',
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'text-14 font-semibold rounded-2xl w-fit h-[3.0625rem] flex items-center justify-center shadow-[0_4px_0_rgba(27,127,203,1)] active:shadow-[0_1px_0_rgba(27,127,203,0.3)] active:translate-y-[3px] transition-all duration-100 ease-out';

    const variantStyles = {
        primary: disabled
            ? 'bg-accent-50 text-white cursor-not-allowed'
            : 'bg-accent text-white',
    };

    const sizeStyles = {
        small: 'px-3 py-3 pr-6 text-xs',
        medium: 'px-4 py-4 pr-6',
        large: 'px-6 py-5 pr-6 text-base',
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

    return (
        <button
            className={combinedClassName}
            disabled={disabled}
            {...props}
        >
            <div className='flex gap-1.5'>
                <Image src="/iconsax-play.svg" alt="Play" width={16} height={16} className="brightness-0 invert" />
                {children}
            </div>
        </button>
    );
}