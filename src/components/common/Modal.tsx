import React, { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const widthClass = size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-3xl' : 'max-w-xl'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 - Glassmorphism 스타일 */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(9, 20, 38, 0.5)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      {/* 모달 카드 */}
      <div
        className={`relative w-full ${widthClass} mx-4 max-h-[90vh] flex flex-col rounded-xl shadow-float`}
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* 헤더 - 배경색으로 구분 (테두리 없음) */}
        <div
          className="flex items-center justify-between px-6 py-4 rounded-t-xl"
          style={{ backgroundColor: '#F5F3F4' }}
        >
          <h2 className="text-base font-bold font-display" style={{ color: '#1B1B1D' }}>{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded flex items-center justify-center transition-colors"
            style={{ color: '#45474C' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EAE7E9' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 flex-1">{children}</div>
      </div>
    </div>
  )
}
