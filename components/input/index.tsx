import React, { ForwardRefRenderFunction, InputHTMLAttributes } from "react";

import { InputContainer, ErrorMessage } from "./styles";

import InputMask from "react-input-mask";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error: string | undefined
    mask?: string
}

const Input: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ error, ...rest }, ref) => {
    return (
        <InputContainer>
            <label htmlFor={rest.name}>{rest.name}</label>
            {rest.name === "phone" || rest.name === "addressZip" ? (
                <InputMask {...rest} ref={ref} />
            ) : (
                <input {...rest} ref={ref} />
            )}

            {!!error && (
                <ErrorMessage>
                    {error}
                </ErrorMessage>
            )}
        </InputContainer>
    )
}


export default React.forwardRef(Input)