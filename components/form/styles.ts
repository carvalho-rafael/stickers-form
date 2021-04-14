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
        border-radius: 5px;
        font-size: inherit;
        font-weight: bold;

        cursor: pointer;

        :disabled {
            background: #010e15;
        }

        :hover {
            background: #010e15;
            transition: all .2s;
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

    button{
        display: block;
        padding: 1rem;
        margin: auto;

        color: #fff;
        background: #023047;
        cursor: pointer;

        border-radius: 5px;
        font-size: inherit;
        font-weight: bold;

        :hover {
            background: #010e15;
            transition: all .2s;
        }
    }
`
