const MetricBanner = ({ value, label, subtitle, className = '' }) => {
  return (
    <div className={`bg-[#F2F2F7] rounded-[32px] flex flex-col items-center justify-center gap-8 w-full ${className}`}>
      {/* Frame 407 - Value and Label Container */}
      <div className="flex flex-col items-center gap-8 w-full">
        {/* Number */}
        {value && (
          <div className="w-full flex items-center justify-center py-4 px-4">
            <div className="text-[48px] font-bold text-[#404040] text-center tracking-[0.05em]">
              {value}
            </div>
          </div>
        )}
        
        {/* Body */}
        {label && (
          <div className="w-full px-4 pb-4">
            <div className="text-xl font-bold text-center leading-[1.4]" style={{ color: '#8C8C8C' }}>
              {label}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricBanner;

