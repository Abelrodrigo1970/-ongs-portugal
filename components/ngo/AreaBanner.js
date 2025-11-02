const AreaBanner = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center gap-8 min-w-[150px] ${className}`}>
      {children}
    </div>
  );
};

export default AreaBanner;

