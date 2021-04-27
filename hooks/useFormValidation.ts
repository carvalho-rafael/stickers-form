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

    function validate(body: {}, formSchema: yup.ObjectSchema<any>, refs: MutableRefObject<HTMLInputElement>[]) {
        formSchemaState = formSchema;

        if(formSchemaState.isValidSync(body)) {
            return true
        }

        formSchemaState.validate(body, { abortEarly: false }).catch(err => {
            _updateErrors(err);

            refs.map(ref => {
                ref.current.addEventListener('keyup', () => _validateField(refs))
            })
        })

        return false;
    }

    function _validateField(refs: MutableRefObject<HTMLInputElement>[]) {
        let body = {}

        refs.forEach(ref => {
            const refName = ref.current.name
            let refValue = ref.current.value

            const hasMask = ref.current.hasAttribute('mask');

            if (hasMask) {
                refValue = refValue.replace(/[^\d]/g, '');
            }

            body[refName] = refValue
        })

        formSchemaState.validate(body, { abortEarly: false }).then(() => {
            setErrors({});
        }).catch(err => {
            _updateErrors(err);
        })
    }

    function _updateErrors(err) {
        const newErros = {};

        err.inner.forEach(item => {
            newErros[item.path] = item.errors
        })
        setErrors(newErros);
    }

    return { errors, setErrors, validate };
}