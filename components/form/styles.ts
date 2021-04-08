import styled from 'styled-components'

export const FormContainer = styled.form`
    width: 100%;
    max-width: 700px;

    padding: 1rem;
    margin: auto;
`

export const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;

    label {
        color: red;
    }

    input[name="email"] {
        width: 400px;
    }

    input[name="phone"] {
        width: 250px;
    }

    input[name="address-street"] {
        width: 500px;
    }

    input[name="address-number"] {
        width: 150px;
    }

    input[name="address-complement"] {
        width: 400px;
    }

    input[name="address-district"] {
        width: 250px;
    }
    input[name="address-city"] {
        width: 325px;
    }

    input[name="address-state"] {
        width: 325px;
    }

    input {
        width: 100%;

        padding: .5rem;
        font-size: inherit;

        @media(max-width: 800px) {
            width:100%!important;
        }    
    }


`

export const InputGroup = styled.div`
    display: flex;
    justify-content: space-between;
    
    @media(max-width: 800px) {
        width:100%;
        flex-direction: column;
    }    
`
