import { PopPupContainer } from "./styles";

export interface PopupProps {
    title: string,
    message: string,
    type: string,
}

export default function Popup({ title, message, type }: PopupProps) {

    return (
        <PopPupContainer type={type} >
            <h3>{title}</h3>
            <p>{message}</p>
        </PopPupContainer>
    )
}