import Image from 'next/image';

const AreaBanner = ({ children, icon, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center gap-8 w-[150px] ${className}`}>
      {icon && (
        <div className="relative w-6 h-6 flex items-center justify-center opacity-90">
          <Image
            src={icon}
            alt=""
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
      )}
      {children}
    </div>
  );
};

export default AreaBanner;

