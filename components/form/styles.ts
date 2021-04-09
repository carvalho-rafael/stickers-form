import styled from 'styled-components'

export const FormTitle = styled.h1`
    text-align: center;
    color: #023047;
`

export const FormContainer = styled.form`
    width: 100%;
    max-width: 700px;

    padding: 1rem;
    margin: auto;

    h3 {
        color: #444;
    }

    button[type="submit"]{
        width: 100%;

        padding: 1rem;
        margin-top: .5rem;

        color: #fff;
        background: #023047;
        font-size: inherit;
        cursor: pointer;

        :disabled {
            background: #010e15;
        }
    }
`

export const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;

    label {
        margin-bottom: .5rem;

        span{
        font-size:12px;
        display: none;

        &.error {
            color: red;
            display: inline;
        }
        }
    }

    input[name="email"] {
        width: 400px;
    }

    input[name="phone"] {
        width: 250px;
    }

    input[name="addressStreet"] {
        width: 500px;
    }

    input[name="addressZip"] {
        width: min-content;
    }

    input[name="addressNumber"] {
        width: 150px;
    }

    input[name="addressComplement"] {
        width: 400px;
    }

    input[name="addressDistrict"] {
        width: 250px;
    }
    input[name="addressCity"] {
        width: 325px;
    }

    input[name="addressState"] {
        width: 325px;
    }

    input {
        width: 100%;

        padding: .5rem;

        border-radius: 5px;
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

export const SuccessMessage = styled.div`
    h1, p {
        text-align: center;
        color: #023047;
    }

    p {
        font-size: 24px;
    }
`
