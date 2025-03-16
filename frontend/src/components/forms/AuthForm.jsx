import React from "react";
import { InputField, PasswordField } from "../inputs";

const AuthForm = ({ title, fields, onSubmit, submitText, footer, register  }) => {
    return (
        <form onSubmit={onSubmit} className="w-[90%] mx-auto">
            {title && <h1 className="pt-12 text-4xl text-primaryColor font-bold text-center">{title}</h1>}
            {fields.map((field, index) => (
                <div key={index} className="mb-4">
                    {field.type === "password" ? (
                        <PasswordField label={field.label} id={field.id} placeholder={field.placeholder} register={register}  error={field.error} />
                    ) : (
                        <InputField label={field.label} id={field.id} type={field.type} placeholder={field.placeholder} register={register}   error={field.error} />
                    )}
                </div>
            ))}
            <button className="w-full px-4 py-3 text-xl font-bold text-white bg-primaryColor rounded-2xl hover:opacity-90">
                {submitText}
            </button>
            {footer && <div className="mt-5 text-center">{footer}</div>}
        </form>
    );
};

export default AuthForm;
