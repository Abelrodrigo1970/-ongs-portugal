const MetricBanner = ({ value, label, subtitle, className = '' }) => {
  return (
    <div 
      className={`flex flex-col items-center w-full ${className}`}
      style={{ 
        backgroundColor: '#F2F2F7',
        borderRadius: '32px',
        gap: '16px'
      }}
    >
      {/* Number */}
      {value && (
        <div 
          className="w-full flex items-center justify-center"
          style={{ 
            padding: '16px 16px 0px'
          }}
        >
          <div 
            style={{ 
              fontSize: '48px',
              fontWeight: '700',
              color: '#404040',
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
            padding: '0px 16px 16px 16px'
          }}
        >
          <div 
            style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: '#8C8C8C',
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

