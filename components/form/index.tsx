import React, { useEffect, useRef, useState } from 'react';
import { FormContainer, FormTitle, InputGroup, SuccessMessage } from './styles'

import Popup, { PopupProps } from '../popup';
import Input from '../input';

interface FormFieldsErrors {
  [key: string]: string
}
export default function Form() {

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

  const [errors, setErrors] = useState<FormFieldsErrors>({});

  const [addressZipState, setAddressZipState] = useState('');
  const [hasZip, setHasZip] = useState(true);

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
        setHasZip(false)
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
        setHasZip(true)
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
      if (response.status === 200) {
        setSent(true)
        setErrors({})
      } else if (response.status === 400) {
        const fields = await response.json()
        const error = {};
        fields.forEach(field => {
          error[field.field] = field.error
        })
        setErrors(error)

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
    })
    setSending(false);
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
        <button onClick={()  => setSent(false)}>Solicitar  outro</button>
      </SuccessMessage>
    )
  }

  return (
    <>
      <FormTitle>Formulário de Adesivos</FormTitle>
      <FormContainer onSubmit={handleSubmit} >
        <h3>Dados Pessoais</h3>
        <Input error={errors.name} type="text" name="name" ref={name} required />
        <InputGroup>
          <Input error={errors.email} type="text" name="email" ref={email} required />
          <Input error={errors.phone} type="tel" name='phone' mask="(99) 99999-9999" ref={phone} required />
        </InputGroup>

        <h3>Endereço</h3>
        <Input error={errors.addresszip} type="text" name='addressZip' mask="99999-999" ref={addressZip} onChange={(e) => setAddressZipState(e.target.value)} required />
        <InputGroup>
          <Input error={errors.addressStreet} type="text" name="addressStreet" disabled={hasZip} ref={addressStreet} required />
          <Input error={errors.addressNumber} type="number" name="addressNumber" ref={addressNumber} required />
        </InputGroup>
        <InputGroup>
          <Input error={errors.addressComplement} type="text" name="addressComplement" ref={addressComplement} required />

          <Input error={errors.addressDistrict} type="text" name="addressDistrict" disabled={hasZip} ref={addressDistrict} required />

        </InputGroup>
        <InputGroup>
          <Input error={errors.addressCity} type="text" name="addressCity" disabled={hasZip} ref={addressCity} required />
          <Input error={errors.addressState} type="text" name="addressState" disabled={hasZip} ref={addressState} required />

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