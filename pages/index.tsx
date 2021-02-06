import Head from 'next/head'
import SignInButton from '../components/sign-in-button'
import { signIn } from 'next-auth/client'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>stinky-site</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        welcome to the base stinky-site
      </main>

      <SignInButton/>
      <footer className={styles.footer}>
        Powered by &nbsp;<a href="https://github.com/heavenly-gumption">heavenly-gumption</a>
      </footer>
    </div>
  )
}