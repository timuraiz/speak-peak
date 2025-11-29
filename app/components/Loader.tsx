interface LoaderProps {
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

export default function Loader({ size = 'medium', className = '' }: LoaderProps) {
    const sizeClasses = {
        small: 'w-16 h-16',
        medium: 'w-32 h-32',
        large: 'w-48 h-48',
    };

    const innerSizeClasses = {
        small: 'inset-2',
        medium: 'inset-4',
        large: 'inset-6',
    };

    const centerDotSizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12',
    };

    return (
        <div className="relative flex items-center justify-center w-10 h-10">
            <div className="absolute bg-accent rounded-full loader-outer"></div>
            <div className="absolute flex items-center justify-center loader-border">
                <div className="bg-accent rounded-full w-3 h-3 loader-inner"></div>
            </div>
        </div>
    );
}

