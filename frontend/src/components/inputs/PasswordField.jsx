import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const PasswordField = ({ label, id, placeholder, register, error }) => {
    const [hidden, setHidden] = useState(true);

    return (
        <div className="relative w-full mb-4">
            <label className="block text-[18px] font-bold text-textBoldColor mb-2" htmlFor={id}>
                {label}
            </label>
            <div className="w-full relative">
                <input
                    className={`border-primary-200 focus:border-primary-400 focus:ring-primary-400 block w-full rounded-xl border-1 py-3 pl-4 pr-10 shadow outline-none transition-all duration-200 focus:ring-1 ${
                        error ? "border-red-500" : ""
                    }`}
                    id={id}
                    type={hidden ? "password" : "text"}
                    placeholder={placeholder}
                    {...register(id)}
                />
                <FontAwesomeIcon
                    onClick={() => setHidden(!hidden)}
                    icon={hidden ? faEyeSlash : faEye}
                    className="absolute bottom-4 right-4 hover:cursor-pointer"
                />
            </div>
            {error && <p className="text-red-500 text-sm ml-2 mt-1">{error}</p>}
        </div>
    );
};

export default PasswordField;
