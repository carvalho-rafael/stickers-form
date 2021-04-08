import { useEffect, useRef } from 'react';
import { FormContainer, InputContainer, InputGroup } from './styles'

import InputMask from "react-input-mask";

export default function Form() {
  const name = useRef<HTMLInputElement>(null);
  const email = useRef();
  const phone = useRef<HTMLInputElement>(null);
  const addressZip = useRef();
  const addressStreet = useRef();
  const addressNumber = useRef();
  const addressComplement = useRef();
  const addressDistrict = useRef();
  const addressCity = useRef();
  const addressState = useRef();

  useEffect(() => {
    name.current.focus();
  })

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(phone.current.value = phone.current.value.replace(/[^\d]/g, ''))
  }
  return (
    <>
      <h1>Formulário de Adesivos</h1>
      <FormContainer onSubmit={handleSubmit}>
        <h3>Dados Pessoais</h3>
        <InputContainer>
          <label htmlFor='name'>Name</label>
          <input 
            name='name' 
            type='text' 
            ref={name}
            required />
        </InputContainer>
        <InputGroup>

          <InputContainer>
            <label htmlFor='email'>Email</label>
            <input name='email' type='email' required />
          </InputContainer>
          <InputContainer>
            <label htmlFor='phone'>Phone</label>
            <InputMask
              mask="(99) 99999-9999"
              name='phone'
              required
              ref={phone}
            ></InputMask>
          </InputContainer>
        </InputGroup>
        <h3>Endereço</h3>
        <InputContainer>
          <label htmlFor='address-zip'>CEP</label>
          <InputMask
            mask="99999-999"
            name='address-zip'
            type='text'
            required ref={addressZip}
          />
        </InputContainer>
        <InputGroup>
          <InputContainer>
            <label htmlFor='address-street'>Rua</label>
            <input name='address-street' type='text' required ref={addressStreet} />
          </InputContainer>
          <InputContainer>
            <label htmlFor='address-number'>Número</label>
            <input name='address-number' type='text' required ref={addressNumber} />
          </InputContainer>
        </InputGroup>
        <InputGroup>
          <InputContainer>
            <label htmlFor='address-complement'>Complemento</label>
            <input name='address-complement' type='text' required ref={addressComplement} />
          </InputContainer>
          <InputContainer>
            <label htmlFor='address-district'>Bairro</label>
            <input name='address-district' type='text' required ref={addressDistrict} />
          </InputContainer>
        </InputGroup>
        <InputGroup>
          <InputContainer>
            <label htmlFor='address-city'>Cidade</label>
            <input name='address-city' type='text' required ref={addressCity} />
          </InputContainer>
          <InputContainer>
            <label htmlFor='address-state'>Estado</label>
            <input name='address-state' type='text' required ref={addressState} />
          </InputContainer>
        </InputGroup>
        <button id='submit' type='submit' >Enviar </button>
      </FormContainer>
    </>
  )
}