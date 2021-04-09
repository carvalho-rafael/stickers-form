import Head from 'next/head'
import Form from '../components/form'

export default function Home() {
  return (
    <>
      <Head>
        <title>Formulário de Adesivos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Form />
    </>
  )
}
