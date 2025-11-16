const AreaBanner = ({ icon, name, className = '' }) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center ${className}`}
      style={{ 
        width: '100%',
        maxWidth: '212px',
        minHeight: '80px',
        borderRadius: '16px',
        border: '1px solid #cbd5e1',
        padding: '12px 8px',
        gap: '4px'
      }}
    >
      {/* Icon and Text Container */}
      <div 
        className="flex flex-col items-center justify-center w-full"
        style={{ 
          minHeight: '50px',
          gap: '4px'
        }}
      >
        {/* Icon */}
        {icon && (
          <div 
            className="flex-shrink-0"
            style={{ 
              width: '20px',
              height: '20px',
              opacity: 0.9
            }}
          >
            {icon}
          </div>
        )}
        
        {/* Name */}
        <div 
          className="text-center w-full px-2"
          style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '700',
            color: '#1e293b',
            lineHeight: '1.5',
            wordWrap: 'break-word'
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
};

export default AreaBanner;
