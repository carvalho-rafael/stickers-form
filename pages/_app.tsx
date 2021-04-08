import GlobalStyle from "../styles/globalStyle"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <GlobalStyle />
      </>
  )
}

export default MyApp
