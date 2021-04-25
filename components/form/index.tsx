import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { FormContainer, FormTitle, InputGroup, SuccessMessage } from './styles';

import Input from '../input';

import * as yup from 'yup';
import useFormValidation from '../../hooks/useFormValidation';
import usePopup from '../popup';

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

  const { errors, setErrors, validate } = useFormValidation();

  const [addressZipState, setAddressZipState] = useState('');
  const [hasZip, setHasZip] = useState(true);

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const { Popup, showPopup } = usePopup();

  useEffect(() => {
    if (name.current)
      name.current.focus();
  }, [])

  useEffect(() => {
    if (addressZipState)
      getZipFromApi()
  }, [addressZipState])

  const formSchema = yup.object().shape({
    name: yup.string().required('Nome obrigatório').min(7, 'O nome deve ter mais que 7 caracteres'),
    email: yup.string().required('E-mail obrigatório').email('Digite um email válido'),
    phone: yup.string().required('Telefone obrigatório'),
    addressZip: yup.string().required('CEP obrigatório'),
    addressStreet: yup.string().required('Logradouro obrigatório'),
    addressNumber: yup.number().typeError('Digite um número').positive('Favor digitar apenas números positivos').required('Número obrigatório'),
    addressComplement: yup.string().required('Complemento obrigatório'),
    addressDistrict: yup.string().required('Bairro obrigatório'),
    addressCity: yup.string().required('Cidade obrigatória'),
    addressState: yup.string().required('Estado obrigatório'),
  });

  async function getZipFromApi() {
    let zipCode = addressZip.current.value.replace(/[^\d]/g, '');

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
        showPopup({
          title: 'Cep não encontrado :(',
          message: 'Tente outro ou preencha os campos manualmente',
          type: 'erro'
        }
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

    const isValido = validate(body, formSchema, [name, email, phone, addressZip, addressNumber, addressStreet, addressComplement, addressDistrict, addressCity, addressState])

    if (!isValido) return;

    setSending(true);

    await fetch('https://simple-api-selection.herokuapp.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(async response => {
      if (response.status === 200) {
        setSent(true)
      } else if (response.status === 400) {

        showPopup({
          title: 'Ops :(',
          message: 'Parece que existem campos incorretos. Tente novmente',
          type: 'erro'
        }
        )
      } else {
        showPopup({
          title: 'Ops :(',
          message: 'Por favor tente novamente mais tarde',
          type: 'erro'
        }
        )
      }
    })

    setSending(false);
  }

  if (sent) {
    return (
      <SuccessMessage>
        <h1>Muito bom!</h1>
        <p>Você receberá seus adesivos em alguns dias</p>
        <button onClick={() => setSent(false)}>Solicitar  outro</button>
      </SuccessMessage>
    )
  }

  return (
    <>
      <FormTitle>Formulário de Adesivos</FormTitle>
      <FormContainer onSubmit={handleSubmit} >
        <h3>Dados Pessoais</h3>
        <Input error={errors.name} type="text" name="name" ref={name} />
        <InputGroup>
          <Input error={errors.email} type="text" name="email" ref={email} />
          <Input error={errors.phone} type="text" name='phone' mask="(99) 99999-9999" ref={phone} />
        </InputGroup>
        <h3>Endereço</h3>
        <Input error={errors.addressZip} type="text" name='addressZip' mask="99999-999" ref={addressZip} onChange={(e) => setAddressZipState(e.target.value)} />
        <InputGroup>
          <Input error={errors.addressStreet} type="text" name="addressStreet" disabled={hasZip} ref={addressStreet} />
          <Input error={errors.addressNumber} type="number" name="addressNumber" ref={addressNumber} />
        </InputGroup>
        <InputGroup>
          <Input error={errors.addressComplement} type="text" name="addressComplement" ref={addressComplement} />
          <Input error={errors.addressDistrict} type="text" name="addressDistrict" disabled={hasZip} ref={addressDistrict} />
        </InputGroup>
        <InputGroup>
          <Input error={errors.addressCity} type="text" name="addressCity" disabled={hasZip} ref={addressCity} />
          <Input error={errors.addressState} type="text" name="addressState" disabled={hasZip} ref={addressState} />
        </InputGroup>
        <button id='submit' type='submit' disabled={sending} >
          {sending ? 'Loading' : 'Enviar'}
        </button>
      </FormContainer>
      <Popup />
    </>
  )
}