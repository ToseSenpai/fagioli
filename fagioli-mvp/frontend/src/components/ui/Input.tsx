import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Premium dark input component with gold focus
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      id,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={clsx(
              'block text-sm font-medium mb-1.5',
              error ? 'text-error-400' : 'text-slate-300',
              disabled && 'opacity-60'
            )}
          >
            {label}
            {required && <span className="text-gold-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          className={clsx(
            'w-full px-4 py-2.5 rounded-lg border text-base text-white',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-900',
            'disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-500',
            'placeholder:text-slate-500',
            // Min height for better touch targets on mobile
            'min-h-[44px]',
            error
              ? 'border-error-500 focus:border-error-500 focus:ring-error-500/50 bg-error-500/10'
              : 'border-slate-600 bg-slate-800 focus:border-gold-500 focus:ring-gold-500/30 hover:border-slate-500',
            className
          )}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-error-400"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
