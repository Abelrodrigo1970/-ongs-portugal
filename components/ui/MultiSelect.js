'use client';

import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

const MultiSelect = ({
  label,
  options = [],
  value = [],
  onChange,
  placeholder = 'Selecionar...',
  error,
  helperText,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleOption = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleRemoveOption = (optionValue) => {
    onChange(value.filter(v => v !== optionValue));
  };

  const selectedOptions = options.filter(option => value.includes(option.value));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full" style={{ backgroundColor: isOpen ? '#FFFFFF' : 'transparent', position: 'relative', zIndex: isOpen ? 10001 : 'auto' }}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1" style={{ backgroundColor: isOpen ? '#FFFFFF' : 'transparent' }}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative" ref={dropdownRef} style={{ zIndex: isOpen ? 10001 : 'auto', backgroundColor: isOpen ? '#FFFFFF' : 'transparent' }}>
        <div
          className={clsx(
            'w-full min-h-[42px] px-3 py-2 border rounded-lg cursor-pointer flex items-center flex-wrap gap-1',
            'focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent',
            error
              ? 'border-red-300 focus-within:ring-red-500'
              : 'border-gray-300 hover:border-gray-400',
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOptions.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {selectedOptions.map(option => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                >
                  {option.label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveOption(option.value);
                    }}
                    className="hover:bg-primary-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <ChevronDown
            className={clsx(
              'h-4 w-4 text-gray-400 ml-auto transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </div>

        {isOpen && (
          <div 
            className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden"
            style={{ zIndex: 10000 }}
          >
            <div className="p-2 border-b border-gray-200 bg-white">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                onClick={(e) => e.stopPropagation()}
                style={{ backgroundColor: '#FFFFFF' }}
              />
            </div>
            <div className="max-h-48 overflow-y-auto bg-white">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  Nenhuma opção encontrada
                </div>
              ) : (
                filteredOptions.map(option => (
                  <div
                    key={option.value}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                    onClick={() => handleToggleOption(option.value)}
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(option.value)}
                      onChange={() => {}}
                      className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-900">{option.label}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default MultiSelect;
