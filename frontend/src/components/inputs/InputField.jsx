import React from "react";

const InputField = ({ label, id, type, placeholder, value, onChange, required, pattern, title }) => {
    return (
        <div className="w-full mb-4 ml-8">
            <label className="block text-[18px] font-bold text-textBoldColor mb-2" htmlFor={id}>
                {label}
            </label>
            <input
                className="block w-full pl-4 pr-10 py-3 shadow rounded-xl outline-none"
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                pattern={pattern}
                title={title}
            />
        </div>
    );
};

export default InputField;
