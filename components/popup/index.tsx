import { useMemo, useState } from "react";
import { PopPupContainer } from "./styles";

export interface PopupProps {
    title: string,
    message: string,
    type: string,
}

export default function usePopup() {
    const [active, setActive] = useState(false)
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')

    function showPopup({ title, message, type }: PopupProps) {
        setTitle(title);
        setMessage(message);
        setType(type);

        setActive(true)

        setTimeout(() => {
            setActive(false)
        }, 9000);
    }

    const Popup = useMemo(() =>
        () => active && (
            <PopPupContainer type={type} >
                <h3>{title}</h3>
                <p>{message}</p>
            </PopPupContainer>
        )
        , [active])

    return { Popup, showPopup };
}