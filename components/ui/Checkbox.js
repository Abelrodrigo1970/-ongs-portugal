import { clsx } from 'clsx';

const Checkbox = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          className={clsx(
            'h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded',
            error && 'border-red-300 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {label && (
          <span className="ml-2 text-sm text-gray-700">{label}</span>
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

export default Checkbox;




























