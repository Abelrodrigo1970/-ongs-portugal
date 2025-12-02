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
            className="absolute w-full mt-1 bg-white overflow-hidden"
            style={{ 
              zIndex: 10000,
              width: '350px',
              paddingTop: '8px',
              paddingBottom: '8px',
              paddingLeft: '24px',
              paddingRight: '4px',
              background: 'white',
              boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.05)',
              borderRadius: '16px',
              outline: '1px #D5E1FF solid',
              outlineOffset: '-1px',
              display: 'inline-flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '16px'
            }}
          >
            {/* Campo de Busca */}
            <div style={{
              alignSelf: 'stretch',
              borderRadius: '32px',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '16px',
              display: 'flex'
            }}>
              <div style={{
                alignSelf: 'stretch',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '16px',
                display: 'inline-flex'
              }}>
                <div style={{
                  flex: '1 1 0',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  paddingLeft: '12px',
                  paddingRight: '16px',
                  borderRadius: '200px',
                  outline: '1px #D5E1FF solid',
                  outlineOffset: '-1px',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: '8px',
                  display: 'flex',
                  background: 'white'
                }}>
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      flex: '1 1 0',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: 'var(--content-text-tertiary, #64748B)',
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '400',
                      lineHeight: '21px'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Lista de Opções */}
            <div style={{
              alignSelf: 'stretch',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '0px',
              display: 'flex',
              maxHeight: '300px',
              overflowY: 'auto',
              width: '100%'
            }}>
              {filteredOptions.length === 0 ? (
                <div style={{
                  alignSelf: 'stretch',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  color: '#595959',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '400',
                  lineHeight: '21px'
                }}>
                  Nenhuma opção encontrada
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    style={{
                      alignSelf: 'stretch',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      borderBottom: index < filteredOptions.length - 1 ? '1px var(--divider, #E2E8F0) solid' : 'none',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      display: 'inline-flex',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                    onClick={() => handleToggleOption(option.value)}
                  >
                    <div style={{
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '8px',
                      display: 'flex'
                    }}>
                      <span style={{
                        color: '#595959',
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: '400',
                        lineHeight: '21px',
                        wordWrap: 'break-word'
                      }}>
                        {option.label}
                      </span>
                    </div>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      position: 'relative'
                    }}>
                      {value.includes(option.value) ? (
                        <>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            left: 0,
                            top: 0,
                            position: 'absolute',
                            background: '#D9D9D9',
                            borderRadius: '0'
                          }} />
                          <div style={{
                            width: '16px',
                            height: '16px',
                            left: '4px',
                            top: '4px',
                            position: 'absolute',
                            background: 'var(--content-fill-tertiary, #64748B)',
                            borderRadius: '0'
                          }} />
                        </>
                      ) : (
                        <div style={{
                          width: '24px',
                          height: '24px',
                          left: 0,
                          top: 0,
                          position: 'absolute',
                          background: '#D9D9D9',
                          borderRadius: '0'
                        }} />
                      )}
                    </div>
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
