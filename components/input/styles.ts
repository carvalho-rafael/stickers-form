import styled from 'styled-components'


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

export const ErrorMessage = styled.span`
    background: red;
`