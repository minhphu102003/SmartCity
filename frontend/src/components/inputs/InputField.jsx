import React from 'react';

const InputField = ({ label, id, type, placeholder, register, error }) => {
  return (
    <div className="mb-4 w-full">
      <label className="mb-2 block text-[18px] font-bold text-textBoldColor" htmlFor={id}>
        {label}
      </label>
      <input
        className={`border-primary-200 focus:border-primary-400 focus:ring-primary-400 block w-full rounded-xl border-1 py-3 pl-4 pr-10 shadow outline-none transition-all duration-200 focus:ring-1 ${
          error ? "border-red-500" : ""
        }`}
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(id)}
      />
      {error && <p className="text-red-500 text-sm ml-2 mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
