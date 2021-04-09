import Head from 'next/head'
import Form from '../components/form'
import { IndexPage } from '../styles/pages'

export default function Home() {
  return (
    <IndexPage>
      <Head>
        <title>Formulário de Adesivos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Formulário de Adesivos</h1>
      <Form />
    </IndexPage>
  )
}
