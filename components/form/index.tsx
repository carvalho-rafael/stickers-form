import React, { useEffect, useRef, useState } from 'react';
import { FormContainer, InputContainer, InputGroup } from './styles'

import InputMask from "react-input-mask";
import Popup from '../popup';

export default function Form() {
  const nameInput = useRef<HTMLInputElement>(null);

  const [popup, setPopup] = useState<any>({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressZip, setAddressZip] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [addressDistrict, setAddressDistrict] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');

  const [sending, setSending] = useState(false);
  const [hasZip, setHasZip] = useState(false);

  useEffect(() => {
    nameInput.current.focus();
  }, [])

  useEffect(() => {
    getZipFromApi()
  }, [addressZip])

  async function getZipFromApi() {
    const zipCode = addressZip.replace(/[^\d]/g, '');

    if (zipCode.length === 8) {
      const result = await fetch(`https://viacep.com.br/ws/${zipCode}/json`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }).then(response => {
        return response.json();
      })

      if (result.erro) {
        setHasZip(true)
      } else {
        console.log(result)
        const { logradouro, bairro, uf, localidade } = result;
        setAddressStreet(logradouro);
        setAddressDistrict(bairro);
        setAddressState(uf);
        setAddressCity(localidade)
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const sanitizedAddressZip = addressZip.replace(/[^\d]/g, '');
    const sanitizedPhone = phone.replace(/[^\d]/g, '');
    const body = {
      name,
      email,
      phone: sanitizedPhone,
      addressZip: sanitizedAddressZip,
      addressNumber,
      addressStreet,
      addressComplement,
      addressDistrict,
      addressCity,
      addressState
    };

    setSending(true);

    const result = await fetch('https://simple-api-selection.herokuapp.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(response => {
      if (response.status === 200) {
        showPopup(
          'Sucesso',
          'Muito bom! Você receberá seus adesivos em alguns dias!',
          'success'
        )
      } else if (response.status === 400) {
        showPopup(
          'Erro',
          'Por favo tente mais tarde',
          'erro'
        )
      }
      return response.json();
    })

    setSending(false);

    console.log(result)

  }

  function showPopup(message, title, type) {
    setPopup({ title, message, show: true, type });
    setTimeout(() => {
      setPopup({ show: false });
    }, 5000)
  }

  return (
    <>
      <Popup
        title={popup.title}
        message={popup.message}
        type={popup.type}
        show={popup.show}
      />

      <FormContainer onSubmit={handleSubmit}>
        <h3>Dados Pessoais</h3>
        <InputContainer>
          <label htmlFor='name'>Name</label>
          <input
            name='name'
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            ref={nameInput}
            required />
        </InputContainer>
        <InputGroup>
          <InputContainer>
            <label htmlFor='email'>Email</label>
            <input
              name='email'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </InputContainer>
          <InputContainer>
            <label htmlFor='phone'>Phone</label>
            <InputMask
              mask="(99) 99999-9999"
              name='phone'
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
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
            value={addressZip}
            onChange={(e) => setAddressZip(e.target.value)}
            required
          />
        </InputContainer>
        <InputGroup>
          <InputContainer>
            <label htmlFor='address-street'>Rua</label>
            <input
              name='address-street'
              type='text'
              value={addressStreet}
              onChange={e => setAddressStreet(e.target.value)}
              disabled={!hasZip}
              required
            />
          </InputContainer>
          <InputContainer>
            <label htmlFor='address-number'>Número</label>
            <input
              name='address-number'
              type='text'
              value={addressNumber}
              onChange={e => setAddressNumber(e.target.value)}
              required

            />
          </InputContainer>
        </InputGroup>
        <InputGroup>
          <InputContainer>
            <label htmlFor='address-complement'>Complemento</label>
            <input
              name='address-complement'
              type='text'
              value={addressComplement}
              onChange={e => setAddressComplement(e.target.value)}
              required
            />
          </InputContainer>
          <InputContainer>
            <label htmlFor='address-district'>Bairro</label>
            <input
              name='address-district'
              type='text'
              value={addressDistrict}
              onChange={e => setAddressDistrict(e.target.value)}
              disabled={!hasZip}
              required
            />
          </InputContainer>
        </InputGroup>
        <InputGroup>
          <InputContainer>
            <label htmlFor='address-city'>Cidade</label>
            <input
              name='address-city'
              type='text'
              value={addressCity}
              onChange={e => setAddressCity(e.target.value)}
              disabled={!hasZip}
              required
            />
          </InputContainer>
          <InputContainer>
            <label htmlFor='address-state'>Estado</label>
            <input
              name='address-state'
              type='text'
              value={addressState}
              onChange={e => setAddressState(e.target.value)}
              disabled={!hasZip}
              required
            />
          </InputContainer>
        </InputGroup>
        <button id='submit' type='submit' disabled={sending} >Enviar </button>
      </FormContainer>
    </>
  )
}