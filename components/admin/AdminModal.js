'use client';

import Button from '@/components/ui/Button';
import { X } from 'lucide-react';

export default function AdminModal({
  title,
  description,
  isOpen,
  onClose,
  children,
  footer,
  size = 'md'
}) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div
        className={`relative w-full mx-4 ${sizes[size]} bg-white rounded-2xl shadow-xl overflow-hidden`}
      >
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/80">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          />
        </div>

        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {footer !== false && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
