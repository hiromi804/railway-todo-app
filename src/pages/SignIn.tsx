/* eslint-disable no-unused-vars */
import { useState } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { Header } from '../components/Header'
import './signin.scss'
import { useDispatch, useSelector } from 'react-redux'
import { signIn } from '../authSlice'
import { url } from '../const'

export const SignIn = () => {
  const auth = useSelector((state: any) => state.auth.isSignIn)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [cookies, setCookie, removeCookie] = useCookies()
  const handleEmailChange = (e: React.FormEvent<HTMLInputElement>) =>
    setEmail((e.target as HTMLInputElement).value)
  const handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) =>
    setPassword((e.target as HTMLInputElement).value)

  const onSignIn = () => {
    axios
      .post(`${url}/signin`, { email: email, password: password })
      .then((res) => {
        setCookie('token', res.data.token)
        dispatch(signIn())
        navigate('/')
      })
      .catch((err) => {
        setErrorMessage(`サインインに失敗しました。${err}`)
      })
  }

  if (auth) return <Navigate to="/" />

  return (
    <div>
      <Header />
      <main className="signin">
        <h2>サインイン</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="signin-form">
          <label className="email-label">メールアドレス</label>
          <br />
          <input
            type="email"
            className="email-input"
            onChange={handleEmailChange}
          />
          <br />
          <label className="password-label">パスワード</label>
          <br />
          <input
            type="password"
            className="password-input"
            onChange={handlePasswordChange}
          />
          <br />
          <button type="button" className="signin-button" onClick={onSignIn}>
            サインイン
          </button>
        </form>
        <Link to="/signup">新規作成</Link>
      </main>
    </div>
  )
}
