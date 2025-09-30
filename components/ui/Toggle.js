import { clsx } from 'clsx';

const Toggle = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            {...props}
          />
          <div
            className={clsx(
              'w-11 h-6 bg-gray-200 rounded-full shadow-inner transition-colors duration-200',
              props.checked && 'bg-primary-600',
              error && 'ring-2 ring-red-500'
            )}
          />
          <div
            className={clsx(
              'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
              props.checked && 'transform translate-x-5'
            )}
          />
        </div>
        {label && (
          <span className="ml-3 text-sm text-gray-700">{label}</span>
        )}
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Toggle;

















