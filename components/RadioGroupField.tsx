import React from 'react';

interface RadioOption {
  value: string;
  label:string;
}

interface RadioGroupFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: RadioOption[];
  required?: boolean;
  error?: string;
}

export const RadioGroupField: React.FC<RadioGroupFieldProps> = ({ label, name, value, onChange, options, required = false, error }) => {
  return (
    <div className="w-full">
      <fieldset id={name}>
        <legend className="block text-sm font-bold text-slate-700 mb-3 tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map(option => (
            <label key={option.value} htmlFor={`${name}-${option.value.replace(/\s+/g, '-')}`} className="cursor-pointer group relative">
              <input
                id={`${name}-${option.value.replace(/\s+/g, '-')}`}
                name={name}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                required={required}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
                className="sr-only peer" // Visually hide the radio button
              />
              <div 
                className={`
                  p-4 rounded-xl border-2 transition-all duration-300 ease-out flex items-center justify-between
                  peer-checked:border-indigo-500 peer-checked:bg-indigo-50/50 peer-checked:shadow-sm
                  bg-white/60 border-slate-200 hover:border-indigo-300 hover:bg-white
                `}
              >
                <span className={`font-medium text-sm transition-colors ${value === option.value ? 'text-indigo-900' : 'text-slate-600'}`}>
                    {option.label}
                </span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${value === option.value ? 'border-indigo-600' : 'border-slate-300'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full bg-indigo-600 transition-transform duration-200 ${value === option.value ? 'scale-100' : 'scale-0'}`}></div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </fieldset>
      {error && (
        <div className="flex items-center mt-2 text-red-500 text-sm animate-pulse">
            <i className="fas fa-exclamation-circle mr-1.5"></i>
            <p id={`${name}-error`}>{error}</p>
        </div>
      )}
    </div>
  );
};