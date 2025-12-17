import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

/**
 * Premium button component with gold accents
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          // Base styles
          'inline-flex items-center justify-center rounded-lg font-semibold',
          'transition-all duration-300 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          'active:scale-[0.98]',

          // Variants
          {
            // Primary: Gold gradient with glow
            'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-slate-900 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 focus:ring-gold-500 shadow-gold hover:shadow-gold-lg hover:scale-[1.02]':
              variant === 'primary',
            // Secondary: Dark with gold border
            'bg-slate-800 text-white border border-slate-600 hover:border-gold-500 hover:text-gold-400 focus:ring-gold-500':
              variant === 'secondary',
            // Outline: Gold border only
            'border-2 border-gold-500 text-gold-500 hover:bg-gold-500/10 focus:ring-gold-500 hover:shadow-gold':
              variant === 'outline',
            // Ghost: Minimal
            'text-slate-300 hover:bg-slate-800 hover:text-gold-400 focus:ring-slate-500':
              variant === 'ghost',
          },

          // Sizes
          {
            'px-3 py-1.5 text-sm min-h-[36px] gap-1.5': size === 'sm',
            'px-5 py-2.5 text-base min-h-[44px] gap-2': size === 'md',
            'px-7 py-3.5 text-lg min-h-[52px] gap-2.5': size === 'lg',
          },

          // Full width
          {
            'w-full': fullWidth,
          },

          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
