/* eslint-disable no-unused-vars */
import axios from 'axios'
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Navigate } from 'react-router-dom'
import { signIn } from '../authSlice'
import { Header } from '../components/Header'
import { url } from '../const'
import './signUp.scss'

export const SignUp = () => {
  const navigate = useNavigate()
  const auth = useSelector((state: any) => state.auth.isSignIn)
  const dispatch = useDispatch()
  const [email, setEmail] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [cookies, setCookie, removeCookie] = useCookies()
  const handleEmailChange = (e: React.FormEvent<HTMLInputElement>) =>
    setEmail((e.target as HTMLInputElement).value)
  const handleNameChange = (e: React.FormEvent<HTMLInputElement>) =>
    setName((e.target as HTMLInputElement).value)
  const handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) =>
    setPassword((e.target as HTMLInputElement).value)

  type setErrorMessage = string | undefined
  const onSignUp = () => {
    const data = {
      email: email,
      name: name,
      password: password,
    }

    axios
      .post(`${url}/users`, data)
      .then((res) => {
        setCookie('token', res.data.token)
        dispatch(signIn())
        navigate('/')
      })
      .catch((err) => {
        setErrorMessage(`サインアップに失敗しました。 ${err}`)
      })

    if (auth) return <Navigate to="/" />
  }
  return (
    <div>
      <Header />
      <main className="signup">
        <h2>新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="signup-form">
          <label>メールアドレス</label>
          <br />
          <input
            type="email"
            onChange={handleEmailChange}
            className="email-input"
          />
          <br />
          <label>ユーザ名</label>
          <br />
          <input
            type="text"
            onChange={handleNameChange}
            className="name-input"
          />
          <br />
          <label>パスワード</label>
          <br />
          <input
            type="password"
            onChange={handlePasswordChange}
            className="password-input"
          />
          <br />
          <button type="button" onClick={onSignUp} className="signup-button">
            作成
          </button>
        </form>
      </main>
    </div>
  )
}
