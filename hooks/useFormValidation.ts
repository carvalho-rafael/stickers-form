import { MutableRefObject, useEffect, useRef, useState } from "react";

import * as yup from 'yup';

interface FormFieldsErrors {
    [key: string]: string[]
}

export default function useFormValidation() {
    const [errors, setErrors] = useState<FormFieldsErrors>({});

    let formSchemaState: yup.ObjectSchema<any>;

    useEffect(() => {
        return () => {
            //limpar listeners
        }
    })

    useEffect(() => {
        console.log(errors)
    }, [errors])

    function validate(formSchema: yup.ObjectSchema<any>, refs: MutableRefObject<HTMLInputElement>[]) {
        formSchemaState = formSchema;

        /*         if(formSchemaState.isValidSync(body)) {
                    return true
                }
        
                formSchemaState.validate(body, { abortEarly: false }).catch(err => {
                    _updateErrors(err);
         */
        refs.map(ref => {
            ref.current.addEventListener('blur', () => _validateField(ref))
        })
        /*         })
         */
        return false;
    }

    function _validateField(ref: MutableRefObject<HTMLInputElement>) {
        let body = {}

        const refName = ref.current.name
        let refValue = ref.current.value

        const hasMask = ref.current.hasAttribute('mask');

        if (hasMask) {
            refValue = refValue.replace(/[^\d]/g, '');
        }

        body[refName] = refValue

        formSchemaState.validateAt(refName, body).then(() => {
            setErrors(prevState => {
                const copy = {...prevState}
                copy[refName] = undefined
                return copy
            });
        }).catch(err => {
            const error = {};
            error[err.path] = err.errors
            setErrors(prevState => ({...prevState, ...error}));

        })
    }

    return { errors, setErrors, validate };
}