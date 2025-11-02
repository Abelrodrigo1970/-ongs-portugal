const MetricBanner = ({ value, label, subtitle, className = '' }) => {
  return (
    <div className={`bg-white rounded-[32px] p-6 flex flex-col items-center justify-center gap-8 w-full ${className}`}>
      {/* Value and Label Container */}
      <div className="flex flex-col items-center gap-8 w-full">
        {value && (
          <div className="w-full flex items-center justify-center pt-4">
            <div className="text-6xl font-bold text-gray-900">
              {value}
            </div>
          </div>
        )}
        
        {label && (
          <div className="w-full px-4 pb-4">
            <div className="text-xl font-bold text-center leading-tight" style={{ color: '#8C8C8C' }}>
              {label}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricBanner;

