import { PopPupContainer } from "./styles";


export default function Popup({ title, message, type, show }) {

    return (
        <PopPupContainer type={type}
            style={{ display: show ? 'flex' : 'none'}}
        >
            <h3>{title}</h3>
            <p>{message}</p>
        </PopPupContainer>
    )
}