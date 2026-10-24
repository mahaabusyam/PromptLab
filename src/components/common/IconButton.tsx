import type { ButtonHTMLAttributes } from 'react'

export function IconButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`relative rounded-lg p-space-xs text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface ${className}`}
      {...props}
    />
  )
}