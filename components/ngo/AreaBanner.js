const AreaBanner = ({ icon, name, className = '' }) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center ${className}`}
      style={{ 
        width: '150px',
        backgroundColor: '#F2F2F7',
        borderRadius: '16px',
        border: '1px solid rgba(64, 64, 64, 0.15)',
        padding: '24px 16px',
        gap: '32px'
      }}
    >
      {/* Icon */}
      {icon && (
        <div 
          style={{ 
            width: '24px',
            height: '24px',
            opacity: 0.9
          }}
        >
          {icon}
        </div>
      )}
      
      {/* Name */}
      <div 
        style={{ 
          fontSize: '16px',
          fontWeight: '400',
          color: '#404040',
          textAlign: 'center',
          lineHeight: '1.5',
          width: '100%'
        }}
      >
        {name}
      </div>
    </div>
  );
};

export default AreaBanner;
