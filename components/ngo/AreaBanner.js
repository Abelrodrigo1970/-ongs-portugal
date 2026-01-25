const AreaBanner = ({ name, className = '' }) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center ${className}`}
      style={{ 
        width: '212px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        padding: '12px',
        overflow: 'hidden'
      }}
    >
      <p 
        className="text-center w-full"
        style={{ 
          fontFamily: 'Inter, sans-serif',
          fontSize: '18px',
          fontWeight: '700',
          color: '#1e293b',
          lineHeight: '1.75',
          wordWrap: 'break-word'
        }}
      >
        {name}
      </p>
    </div>
  );
};

export default AreaBanner;
