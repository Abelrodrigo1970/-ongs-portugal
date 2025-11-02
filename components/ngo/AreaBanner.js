const AreaBanner = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center gap-8 w-[150px] ${className}`}>
      {children}
    </div>
  );
};

export default AreaBanner;

