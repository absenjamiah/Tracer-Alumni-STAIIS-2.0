import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  readOnly?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = 'text', placeholder, required = false, error, readOnly = false }) => {
  const errorClasses = "border-red-300 bg-red-50/50 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500";
  const defaultClasses = "border-slate-200/80 bg-white/60 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder-slate-400";
  const readOnlyClasses = "bg-slate-100/50 text-slate-500 cursor-not-allowed border-transparent";
  
  return (
    <div className="w-full group">
      <label htmlFor={name} className="block text-sm font-bold text-slate-700 mb-1.5 transition-colors group-focus-within:text-indigo-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder || `Masukkan ${label.toLowerCase()}...`}
            required={required}
            readOnly={readOnly}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            className={`
                block w-full px-4 py-3.5 rounded-xl border shadow-sm transition-all duration-200 backdrop-blur-sm
                focus:outline-none focus:ring-2 focus:ring-opacity-50
                disabled:opacity-60
                ${error ? errorClasses : defaultClasses} 
                ${readOnly ? readOnlyClasses : 'hover:bg-white'}
            `}
        />
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-red-600 font-medium flex items-center">
            <i className="fas fa-exclamation-triangle mr-1.5 text-xs"></i>
            {error}
        </p>
      )}
    </div>
  );
};