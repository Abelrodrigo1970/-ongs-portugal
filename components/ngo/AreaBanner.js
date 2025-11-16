const AreaBanner = ({ icon, name, className = '' }) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center ${className}`}
      style={{ 
        width: '212px',
        height: '92px',
        borderRadius: '16px',
        border: '1px solid #cbd5e1',
        padding: '16px 8px',
        gap: '4px'
      }}
    >
      {/* Icon and Text Container */}
      <div 
        className="flex flex-col items-center justify-center"
        style={{ 
          width: '150px',
          height: '60px',
          gap: '4px'
        }}
      >
        {/* Icon */}
        {icon && (
          <div 
            style={{ 
              width: '24px',
              height: '24px',
              opacity: 0.9,
              flexShrink: 0
            }}
          >
            {icon}
          </div>
        )}
        
        {/* Name */}
        <div 
          style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '18px',
            fontWeight: '700',
            color: '#1e293b',
            textAlign: 'center',
            lineHeight: '1.75',
            width: '100%'
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
};

export default AreaBanner;
