import React from "react";
import { InputField, PasswordField } from "../inputs";

const AuthForm = ({ title, fields, onSubmit, submitText, footer }) => {
    return (
        <form onSubmit={onSubmit} className="pb-12 w-[90%] mx-auto pl-5 pr-5">
            <h1 className="pt-12 text-4xl text-primaryColor font-bold text-center">{title}</h1>
            {fields.map((field, index) =>
                field.type === "password" ? (
                    <PasswordField key={index} {...field} />
                ) : (
                    <InputField key={index} {...field} />
                )
            )}
            <button className="w-full px-4 py-3 text-xl font-bold text-white bg-primaryColor rounded-2xl hover:opacity-90">
                {submitText}
            </button>
            {footer && <div className="mt-5 text-center">{footer}</div>}
        </form>
    );
};

export default AuthForm;
