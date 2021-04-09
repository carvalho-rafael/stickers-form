import styled from 'styled-components';

export const PopPupContainer = styled.div<{ type?: string }>`
    display: flex;
    flex-direction: column;

    padding: 1rem 2rem;

    position: fixed;
    top: 30px;
    right: 30px;

    justify-content: space-evenly;
    background: ${props => props.type === 'erro' ? "red" : "blue"};
    color: white;

    border-radius: .5rem;
    animation: fadein 1s ease-out;

    z-index: 999;

    &.erro {
        background: red;
    }

    h3 {
        margin: 0;
        margin-bottom: 1rem;
    }

    p {
        margin: 0;
    }
}

@keyframes fadein {
    from {
        transform: translateY(-100px);
    }
    to {
        transform: translateY(0px);
    }

`
