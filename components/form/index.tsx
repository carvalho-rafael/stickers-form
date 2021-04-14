import React, { useEffect, useRef, useState } from 'react';
import { FormContainer, FormTitle, InputGroup, SuccessMessage } from './styles'

import Popup, { PopupProps } from '../popup';
import Input from '../input';

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
      console.log(result)
      showPopup(
        'Ops :(',
        'Parece que existem campos incorretos. Tente novmente',
        'erro'
      )

    } else {
      showPopup(
        'Ops :(',
        'Por favor tente novamente mais tarde',
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
        <Input error={'rr'} type="text" name="name" ref={name} required />
        <InputGroup>
          <Input error={'do'} type="text" name="email" ref={email} required />
          <Input error={'do'} type="text" name='phone' mask="(99) 99999-9999" ref={phone} required />
        </InputGroup>

        <h3>Endereço</h3>
        <Input error={'do'} type="text" name='addressZip' mask="99999-999" ref={addressZip} onChange={(e) => setAddressZipState(e.target.value)} required />
        <InputGroup>
          <Input error={'do'} type="text" name="addressStreet" ref={addressStreet} required />
          <Input error={'do'} type="text" name="addressNumber" ref={addressNumber} required />
        </InputGroup>
        <InputGroup>
        <Input error={'do'} type="text" name="addressComprement" ref={addressComplement} required />

        <Input error={'do'} type="text" name="addressDistrict" ref={addressDistrict} required />

        </InputGroup>
        <InputGroup>
        <Input error={'do'} type="text" name="addressCity" ref={addressCity} required />
        <Input error={'do'} type="text" name="addressState" ref={addressState} required />

        </InputGroup>
        <button id='submit' type='submit' disabled={sending} >
          {sending ? 'Loading' : 'Enviar'}
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