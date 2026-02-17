'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, required, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full rounded-lg border px-3 py-2 text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
            error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400',
            props.disabled && 'cursor-not-allowed bg-gray-100 text-gray-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
