import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(({
    label,
    error,
    helperText,
    className = '',
    id,
    value,
    ...props
}, ref) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-') || 'field'}`;
    const isFilled = value !== undefined && value !== null && value !== '';

    // Base styles for all states
    const baseStyles = 'w-full px-4 py-4.5 rounded-2xl border transition-all duration-200 focus:outline-none';

    // Default state: transparent border, subtle background, light text (only when not filled)
    const defaultStyles = !isFilled ? 'bg-background text-dark-50 border-transparent' : '';

    // Hover state: slightly darker background
    const hoverStyles = 'hover:bg-hover';

    // Focus state: blue border, white background, dark text
    const focusStyles = 'focus:border-accent focus:bg-white focus:text-dark';

    // Filled state: white background, dark text (when value exists)
    const filledStyles = isFilled ? 'bg-background text-dark border-transparent' : '';

    // Error state
    const errorStyles = error ? 'border-red focus:border-red' : '';

    const combinedClassName = `${baseStyles} ${defaultStyles} ${hoverStyles} ${focusStyles} ${filledStyles} ${errorStyles} ${className}`.trim();

    const input = (
        <input
            ref={ref}
            id={inputId}
            className={combinedClassName}
            value={value}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
        />
    );

    // If there's an error or helper text, wrap in div, otherwise return input directly
    if (error || helperText) {
        return (
            <div className="w-full">
                {input}
                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="text-xs text-red mt-1"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
                {!error && helperText && (
                    <p
                        id={`${inputId}-helper`}
                        className="text-xs text-dark-50 mt-1"
                    >
                        {helperText}
                    </p>
                )}
            </div>
        );
    }

    return input;
});

InputField.displayName = 'InputField';

export default InputField;

