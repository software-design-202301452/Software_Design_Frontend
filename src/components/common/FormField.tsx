import React from 'react'

// Stitch 디자인 시스템 - 입력 필드는 filled 스타일 (box 테두리 없음, 하단 강조선)
interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}

export function FormField({ label, required, error, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#45474C', letterSpacing: '0.05em' }}>
        {label}
        {required && <span className="ml-1" style={{ color: '#BA1A1A' }}>*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs" style={{ color: '#BA1A1A' }}>{error}</p>}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({ error, className = '', style, ...props }: InputProps) {
  return (
    <input
      className={`w-full px-3 py-2.5 rounded text-sm outline-none transition-all ${className}`}
      style={{
        backgroundColor: '#F5F3F4',
        color: '#1B1B1D',
        border: 'none',
        borderBottom: error ? '2px solid #BA1A1A' : '2px solid transparent',
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderBottomColor = error ? '#BA1A1A' : '#0058BE'
        e.currentTarget.style.backgroundColor = '#FFFFFF'
        props.onFocus?.(e)
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderBottomColor = error ? '#BA1A1A' : 'transparent'
        e.currentTarget.style.backgroundColor = '#F5F3F4'
        props.onBlur?.(e)
      }}
      {...props}
    />
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}

export function Select({ error, className = '', children, ...props }: SelectProps) {
  return (
    <select
      className={`w-full px-3 py-2.5 rounded text-sm outline-none transition-all ${className}`}
      style={{
        backgroundColor: '#F5F3F4',
        color: '#1B1B1D',
        border: 'none',
        borderBottom: error ? '2px solid #BA1A1A' : '2px solid transparent',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderBottomColor = error ? '#BA1A1A' : '#0058BE'
        e.currentTarget.style.backgroundColor = '#FFFFFF'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderBottomColor = error ? '#BA1A1A' : 'transparent'
        e.currentTarget.style.backgroundColor = '#F5F3F4'
      }}
      {...props}
    >
      {children}
    </select>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function Textarea({ error, className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full px-3 py-2.5 rounded text-sm outline-none transition-all resize-none ${className}`}
      style={{
        backgroundColor: '#F5F3F4',
        color: '#1B1B1D',
        border: 'none',
        borderBottom: error ? '2px solid #BA1A1A' : '2px solid transparent',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderBottomColor = error ? '#BA1A1A' : '#0058BE'
        e.currentTarget.style.backgroundColor = '#FFFFFF'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderBottomColor = error ? '#BA1A1A' : 'transparent'
        e.currentTarget.style.backgroundColor = '#F5F3F4'
      }}
      {...props}
    />
  )
}
