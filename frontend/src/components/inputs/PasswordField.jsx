import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const PasswordField = ({ label, id, placeholder, value, onChange }) => {
    const [hidden, setHidden] = useState(true);

    return (
        <div className="relative w-full mb-4 ml-8">
            <label className="block text-[18px] font-bold text-textBoldColor mb-2" htmlFor={id}>
                {label}
            </label>
            <div className="w-full">
                <input
                    className="block w-full pl-4 pr-10 py-3 shadow rounded-xl outline-none"
                    id={id}
                    type={hidden ? "password" : "text"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required
                />
                <FontAwesomeIcon
                    onClick={() => setHidden(!hidden)}
                    icon={hidden ? faEyeSlash : faEye}
                    className="absolute bottom-4 right-4 hover:cursor-pointer"
                />
            </div>
        </div>
    );
};

export default PasswordField;
