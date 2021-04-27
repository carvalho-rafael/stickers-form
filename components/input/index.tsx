import React, { ForwardRefRenderFunction, InputHTMLAttributes } from "react";

import { InputContainer, ErrorMessage } from "./styles";

import InputMask from "react-input-mask";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string[]
    mask?: string
}

const Input: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ error, ...rest }, ref) => {
    return (
        <InputContainer>
            <label htmlFor={rest.name}>{rest.name}</label>
            {rest.name === "phone" || rest.name === "addressZip" ? (
                <InputMask mask='' {...rest}>{inputProps => <input ref={ref} mask='' {...inputProps} />}</InputMask>
            ) : (
                <input {...rest} ref={ref} />
            )}
            {!!error && (
                <ErrorMessage>
                    {error.map(erro => erro)}
                </ErrorMessage>
            )}
        </InputContainer>
    )
}

export default React.forwardRef(Input)