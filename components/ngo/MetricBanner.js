const MetricBanner = ({ value, label, subtitle, className = '' }) => {
  return (
    <div 
      className={`flex flex-col items-center w-full ${className}`}
      style={{ 
        gap: '8px',
        width: '188px',
        height: '94px'
      }}
    >
      {/* Number */}
      {value && (
        <div 
          className="w-full flex items-center justify-center"
          style={{ 
            padding: '0'
          }}
        >
          <div 
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: '48px',
              fontWeight: '700',
              color: '#020617',
              textAlign: 'center',
              lineHeight: '1.2',
              width: '100%'
            }}
          >
            {value}
          </div>
        </div>
      )}
      
      {/* Body */}
      {label && (
        <div 
          className="w-full"
          style={{ 
            padding: '0'
          }}
        >
          <div 
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: '20px',
              fontWeight: '700',
              color: '#64748b',
              textAlign: 'center',
              lineHeight: '1.4',
              width: '100%'
            }}
          >
            {label}
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricBanner;

