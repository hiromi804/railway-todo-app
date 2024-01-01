import { useState } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { Header } from '../components/Header'
import { useNavigate } from 'react-router-dom'
import { url } from '../const'
import './newList.scss'

export const NewList = () => {
  const [cookies] = useCookies<string>()
  const navigate = useNavigate()
  const [title, setTitle] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const handleTitleChange = (e: React.FormEvent<HTMLInputElement>) =>
    setTitle((e.target as HTMLInputElement).value)
  const onCreateList = () => {
    const data = {
      title: title,
    }

    axios
      .post(`${url}/lists`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/', { state: { message: '成功' } })
      })
      .catch((err) => {
        setErrorMessage(`リストの作成に失敗しました。${err}`)
      })
  }

  return (
    <div>
      <Header />
      <main className="new-list">
        <h2 className="title">リスト新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="new-list-form">
          <label>タイトル</label>
          <br />
          <input
            type="text"
            onChange={handleTitleChange}
            className="new-list-title"
          />
          <br />
          <button
            type="button"
            onClick={onCreateList}
            className="new-list-button"
          >
            作成
          </button>
        </form>
      </main>
    </div>
  )
}
