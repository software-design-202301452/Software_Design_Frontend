import React from 'react'

// Stitch 디자인 시스템 - 배지는 rounded-full 사용 (컨테이너 rounded-md와 대비)
type BadgeVariant = 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'purple'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
}

const variantStyle: Record<BadgeVariant, React.CSSProperties> = {
  blue: { backgroundColor: '#D8E2FF', color: '#0058BE' },
  green: { backgroundColor: '#D4EDDA', color: '#1A6B3C' },
  red: { backgroundColor: '#FFDAD6', color: '#BA1A1A' },
  yellow: { backgroundColor: '#FFF3CD', color: '#856404' },
  gray: { backgroundColor: '#EAE7E9', color: '#45474C' },
  purple: { backgroundColor: '#EDE9FE', color: '#5B21B6' },
}

export default function Badge({ children, variant = 'gray' }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={variantStyle[variant]}
    >
      {children}
    </span>
  )
}
