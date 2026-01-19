'use client';

import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, Search, ChevronUp, X } from 'lucide-react';

const MultiSelect = ({
  label,
  options = [],
  value = [],
  onChange,
  placeholder = 'Selecionar...',
  error,
  helperText,
  className = '',
  hideTriggerButton = false, // Nova prop para ocultar o botão quando usado no FilterBar
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(hideTriggerButton); // Se hideTriggerButton for true, começa aberto
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollTopRef = useRef(0);
  const scrollbarThumbRef = useRef(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleOption = (optionValue) => {
    if (scrollContainerRef.current) {
      scrollTopRef.current = scrollContainerRef.current.scrollTop;
    }
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleRemoveOption = (optionValue) => {
    onChange(value.filter(v => v !== optionValue));
  };

  const selectedOptions = options.filter(option => value.includes(option.value));

  const handleScrollUp = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: -50, behavior: 'smooth' });
    }
  };

  const handleScrollDown = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: 50, behavior: 'smooth' });
    }
  };

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

  // Restaurar scroll ao alterar a seleção
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const savedScrollTop = scrollTopRef.current;
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = savedScrollTop;
      }
    });
  }, [value]);

  // Atualizar scrollbar quando o scroll mudar
  useEffect(() => {
    if (!isOpen || !scrollContainerRef.current || !scrollbarThumbRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    const thumb = scrollbarThumbRef.current;

    const updateScrollbar = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const trackHeight = scrollContainer.clientHeight;
      const thumbMinHeight = 36;
      
      if (scrollHeight <= clientHeight) {
        thumb.style.display = 'none';
        return;
      }
      
      thumb.style.display = 'block';
      const scrollableHeight = scrollHeight - clientHeight;
      const thumbHeight = Math.max(thumbMinHeight, (clientHeight / scrollHeight) * (trackHeight - 32));
      const maxThumbTop = trackHeight - thumbHeight - 32;
      const thumbTop = (scrollTop / scrollableHeight) * maxThumbTop;
      
      thumb.style.top = `${16 + thumbTop}px`;
      thumb.style.height = `${thumbHeight}px`;
    };

    updateScrollbar();
    scrollContainer.addEventListener('scroll', updateScrollbar);
    
    // Atualizar quando o conteúdo mudar
    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(scrollContainer);

    return () => {
      scrollContainer.removeEventListener('scroll', updateScrollbar);
      resizeObserver.disconnect();
    };
  }, [isOpen, filteredOptions.length]);

  return (
    <div className="w-full" style={{ backgroundColor: isOpen ? '#FFFFFF' : 'transparent', position: 'relative', zIndex: isOpen ? 10001 : 'auto' }}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1" style={{ backgroundColor: isOpen ? '#FFFFFF' : 'transparent' }}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative" ref={dropdownRef} style={{ zIndex: isOpen ? 10001 : 'auto', backgroundColor: isOpen ? '#FFFFFF' : 'transparent' }}>
        {!hideTriggerButton && (
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
        )}

        {isOpen && (
          <div 
            className="absolute mt-1 bg-white"
            style={{ 
              zIndex: 10000,
              width: '320px',
              height: '509px',
              paddingLeft: '24px',
              paddingRight: '4px',
              paddingTop: '8px',
              paddingBottom: '8px',
              background: 'white',
              boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.05)',
              borderRadius: '16px',
              outline: '1px #D5E1FF solid',
              outlineOffset: '-1px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: '16px',
              overflow: 'hidden'
            }}
          >
            {/* Conteúdo Principal */}
            <div style={{
              flex: '1 0 0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '24px',
              paddingTop: '16px',
              paddingBottom: '12px',
              paddingLeft: '0',
              paddingRight: '0',
              minHeight: '0',
              minWidth: '0'
            }}>
              {/* Container da Lista */}
              <div style={{
                alignSelf: 'stretch',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '16px',
                width: '100%'
              }}>
                {/* Campo de Busca */}
                <div style={{
                  alignSelf: 'stretch',
                  borderRadius: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}>
                  <div style={{
                    alignSelf: 'stretch',
                    display: 'inline-flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '16px',
                    position: 'sticky',
                    top: '0'
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
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'white'
                    }}>
                      <Search 
                        style={{ 
                          width: '24px', 
                          height: '24px',
                          color: '#64748B',
                          flexShrink: 0
                        }} 
                      />
                      <input
                        type="text"
                        placeholder="Search Bar Text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          flex: '1 1 0',
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          color: '#64748B',
                          fontSize: '14px',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: '400',
                          lineHeight: '21px'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Lista de Opções com Scroll */}
                <div 
                  ref={scrollContainerRef}
                  style={{
                    alignSelf: 'stretch',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: '0px',
                    maxHeight: 'calc(509px - 120px)',
                    overflowY: 'auto',
                    width: '100%',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                  className="custom-scroll-container"
                  onScroll={() => {
                    // O scroll é gerenciado pelo useEffect
                  }}
                >
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
                      <button
                        key={option.value}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        style={{
                          alignSelf: 'stretch',
                          paddingTop: '12px',
                          paddingBottom: '12px',
                          borderBottom: index < filteredOptions.length - 1 ? '1px #E2E8F0 solid' : 'none',
                          borderTop: 'none',
                          borderLeft: 'none',
                          borderRight: 'none',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          display: 'inline-flex',
                          cursor: 'pointer',
                          width: '100%',
                          background: 'transparent',
                          textAlign: 'left'
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
                          position: 'relative',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {value.includes(option.value) ? (
                            <div style={{
                              width: '24px',
                              height: '24px',
                              background: '#FFFFFF',
                              border: '1px solid #64748B',
                              borderRadius: '0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative'
                            }}>
                              <X 
                                size={16} 
                                style={{ 
                                  color: '#64748B',
                                  strokeWidth: 3
                                }} 
                              />
                            </div>
                          ) : (
                            <div style={{
                              width: '24px',
                              height: '24px',
                              background: '#FFFFFF',
                              border: '1px solid #D9D9D9',
                              borderRadius: '0'
                            }} />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Scrollbar Customizado */}
            <div 
              className="custom-scrollbar"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '16px',
                height: '100%',
                width: '16px',
                flexShrink: 0,
                paddingTop: '0',
                paddingBottom: '0',
                paddingLeft: '0',
                paddingRight: '0'
              }}
            >
              {/* Seta para cima */}
              <button
                type="button"
                onClick={handleScrollUp}
                style={{
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <ChevronUp 
                  size={16} 
                  style={{ 
                    color: '#1e293b',
                    width: '16px',
                    height: '16px'
                  }} 
                />
              </button>

              {/* Track do Scrollbar */}
              <div style={{
                flex: '1 0 0',
                width: '16px',
                position: 'relative',
                minHeight: '36px'
              }}>
                {/* Thumb do Scrollbar */}
                <div 
                  ref={scrollbarThumbRef}
                  className="scrollbar-thumb"
                  style={{
                    position: 'absolute',
                    left: '2px',
                    top: '16px',
                    width: '12px',
                    height: '36px',
                    background: '#1e293b',
                    borderRadius: '533.33px',
                    transition: 'top 0.1s ease-out',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Seta para baixo */}
              <button
                type="button"
                onClick={handleScrollDown}
                style={{
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <ChevronDown 
                  size={16} 
                  style={{ 
                    color: '#1e293b',
                    width: '16px',
                    height: '16px'
                  }} 
                />
              </button>
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
