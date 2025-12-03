import React from 'react';
import Image from 'next/image';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'primary-no-icon';
    size?: 'small' | 'medium' | 'large';
    children: React.ReactNode;
    icon?: string;
}

export default function Button({
    variant = 'primary',
    size = 'medium',
    children,
    className = '',
    disabled,
    icon,
    ...props
}: ButtonProps) {
    const isPrimaryVariant = variant === 'primary' || variant === 'primary-no-icon';

    const baseStyles = isPrimaryVariant
        ? 'text-14 font-semibold rounded-2xl w-fit h-[3.0625rem] flex items-center justify-center shadow-[0_4px_0_rgba(27,127,203,1)] active:shadow-[0_1px_0_rgba(27,127,203,0.3)] active:translate-y-[3px] transition-all duration-100 ease-out'
        : 'text-14 font-semibold rounded-2xl w-fit h-[3.0625rem] flex items-center justify-center shadow-[0_4px_0_var(--color-button-secondary)] active:shadow-[0_1px_0_var(--color-button-secondary)] active:translate-y-[3px] transition-all duration-100 ease-out';

    const variantStyles = {
        primary: disabled
            ? 'bg-accent-50 text-white cursor-not-allowed'
            : 'bg-accent text-white',
        'primary-no-icon': disabled
            ? 'bg-accent-50 text-white cursor-not-allowed'
            : 'bg-accent text-white',
        secondary: disabled
            ? 'bg-white border border-[var(--color-button-secondary)] text-dark-50 cursor-not-allowed'
            : 'bg-white border border-[var(--color-button-secondary)] text-dark-50',
    };

    const sizeStyles = {
        small: variant === 'primary' ? 'px-3 py-3 pr-6 text-xs' : variant === 'primary-no-icon' ? 'px-6 py-3 text-xs' : 'px-3 py-3 text-xs',
        medium: variant === 'primary' ? 'px-4 py-4 pr-6' : variant === 'primary-no-icon' ? 'px-6 py-4' : 'px-6 py-4',
        large: variant === 'primary' ? 'px-6 py-5 pr-6 text-base' : variant === 'primary-no-icon' ? 'px-6 py-5 text-base' : 'px-6 py-5 text-base',
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

    return (
        <button
            className={combinedClassName}
            disabled={disabled}
            {...props}
        >
            <div className={variant === 'primary' ? 'flex gap-1.5' : 'flex items-center justify-center'}>
                {variant === 'primary' && (
                    <Image src={icon || "/iconsax-play.svg"} alt="Icon" width={16} height={16} className="brightness-0 invert" />
                )}
                {children}
            </div>
        </button>
    );
}