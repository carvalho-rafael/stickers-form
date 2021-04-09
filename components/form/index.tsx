import React, { useEffect, useRef, useState } from 'react';
import { FormContainer, FormTitle, InputContainer, InputGroup, SuccessMessage } from './styles'

import InputMask from "react-input-mask";
import Popup, { PopupProps } from '../popup';

export default function Form() {
  const form = useRef<HTMLFormElement>(null);

  const name = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const phone = useRef<HTMLInputElement>(null);
  const addressZip = useRef<HTMLInputElement>(null);
  const addressNumber = useRef<HTMLInputElement>(null);
  const addressStreet = useRef<HTMLInputElement>(null);
  const addressComplement = useRef<HTMLInputElement>(null);
  const addressDistrict = useRef<HTMLInputElement>(null);
  const addressCity = useRef<HTMLInputElement>(null);
  const addressState = useRef<HTMLInputElement>(null);

  const [addressZipState, setAddressZipState] = useState('');
  const [hasZip, setHasZip] = useState(false);

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const [popupProps, setPopupProps] = useState<PopupProps>();
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    if (name.current)
      name.current.focus();
  }, [])

  useEffect(() => {
    if (addressZipState)
      getZipFromApi()
  }, [addressZipState])

  async function getZipFromApi() {
    const zipCode = addressZip.current.value.replace(/[^\d]/g, '');

    if (zipCode.length === 8) {
      const result = await fetch(`https://viacep.com.br/ws/${zipCode}/json`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }).then(response => {
        return response.json();
      })

      if (result.erro) {
        setHasZip(true)
        addressStreet.current.value = '';
        addressDistrict.current.value = '';
        addressState.current.value = '';
        addressCity.current.value = ''
        showPopup(
          'Cep não encontrado :(',
          'Tente outro ou preencha os campos manualmente',
          'erro'
        )
      } else {
        setHasZip(false)
        const { logradouro, bairro, uf, localidade } = result;
        addressStreet.current.value = logradouro;
        addressDistrict.current.value = bairro;
        addressState.current.value = uf;
        addressCity.current.value = localidade;
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const sanitizedAddressZip = addressZip.current.value.replace(/[^\d]/g, '');
    const sanitizedPhone = phone.current.value.replace(/[^\d]/g, '');
    const body = {
      name: name.current.value,
      email: email.current.value,
      phone: sanitizedPhone,
      addressZip: sanitizedAddressZip,
      addressNumber: addressNumber.current.value,
      addressStreet: addressStreet.current.value,
      addressComplement: addressComplement.current.value,
      addressDistrict: addressDistrict.current.value,
      addressCity: addressCity.current.value,
      addressState: addressState.current.value
    };

    setSending(true);

    const result = await fetch('https://simple-api-selection.herokuapp.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(async response => {
      const body = await response.json()

      return {
        body,
        status: response.status
      }
    })

    if (result.status === 200) {
      setSent(true)

    } else if (result.status === 400) {
      const labels = document.getElementsByTagName('label')

      for (let item of Array.from(labels)) {
        item.firstElementChild.classList.remove('error')
      }

      result.body.forEach(field => {

        for (let item of Array.from(labels))
          if (item.htmlFor === field.field) {
            const errorElement = item.firstElementChild
            errorElement.classList.add('error')
            errorElement.innerHTML = field.error

          }
      });

      showPopup(
        'Ops :(',
        'Parece que existem campos incorretos. Tente novmente',
        'erro'
      )

    } else {
      showPopup(
        'Ops :(',
        'Por favo tente novamente mais tarde',
        'erro'
      )
    }

    setSending(false);

    console.log(result)

  }

  function showPopup(title, message, type) {
    setPopupProps({ title, message, type });
    setPopup(true);
    setTimeout(() => {
      setPopup(false)
    }, 5000)
  }

  if (sent) {
    return (
      <SuccessMessage>
        <h1>Muito bom!</h1>
        <p>Você receberá seus adesivos em alguns dias</p>
      </SuccessMessage>
    )
  }

  return (
    <>
      <FormTitle>Formulário de Adesivos</FormTitle>
      <FormContainer onSubmit={handleSubmit} ref={form}>
        <h3>Dados Pessoais</h3>
        <InputContainer>
          <label htmlFor='name'>Nome* <span></span></label>
          <input
            name='name'
            type='text'
            ref={name}
            required />
        </InputContainer>
        <InputGroup>
          <InputContainer>
            <label htmlFor='email'>Email* <span></span></label>
            <input
              name='email'
              type='email'
              ref={email}
              required
            />
          </InputContainer>
          <InputContainer>
            <label htmlFor='phone'>Phone* <span></span></label>
            <InputMask
              mask="(99) 99999-9999"
              name='phone'
              ref={phone}
              required
            ></InputMask>
          </InputContainer>
        </InputGroup>

        <h3>Endereço</h3>
        <InputContainer>
          <label htmlFor='addressZip'>CEP* <span></span></label>
          <InputMask
            mask="99999-999"
            name='addressZip'
            type='text'
            ref={addressZip}
            onChange={(e) => setAddressZipState(e.target.value)}
            required
          />
        </InputContainer>
        <InputGroup>
          <InputContainer>
            <label htmlFor='addressStreet'>Rua* <span></span></label>
            <input
              name='addressStreet'
              type='text'
              ref={addressStreet}
              disabled={!hasZip}
              required
            />
          </InputContainer>
          <InputContainer>
            <label htmlFor='addressNumber'>Número* <span></span></label>
            <input
              name='addressNumber'
              type='number'
              ref={addressNumber}
              required

            />
          </InputContainer>
        </InputGroup>
        <InputGroup>
          <InputContainer>
            <label htmlFor='addressComplement'>Complemento* <span></span></label>
            <input
              name='addressComplement'
              type='text'
              ref={addressComplement}
              required
            />
          </InputContainer>
          <InputContainer>
            <label htmlFor='addressDistrict'>Bairro* <span></span></label>
            <input
              name='addressDistrict'
              type='text'
              ref={addressDistrict}
              disabled={!hasZip}
              required
            />
          </InputContainer>
        </InputGroup>
        <InputGroup>
          <InputContainer>
            <label htmlFor='addressCity'>Cidade* <span></span></label>
            <input
              name='addressCity'
              type='text'
              ref={addressCity}
              disabled={!hasZip}
              required
            />
          </InputContainer>
          <InputContainer>
            <label htmlFor='addressState'>Estado* <span></span></label>
            <input
              name='addressState'
              type='text'
              ref={addressState}
              disabled={!hasZip}
              required
            />
          </InputContainer>
        </InputGroup>
        <button id='submit' type='submit' disabled={sending} >
          {sending? 'Loading': 'Enviar'}
        </button>
      </FormContainer>

      {popup && (
        <Popup
          title={popupProps.title}
          message={popupProps.message}
          type={popupProps.type}
        />
      )}
    </>
  )
}