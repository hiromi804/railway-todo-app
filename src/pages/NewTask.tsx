import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { url } from '../const'
import { Header } from '../components/Header'
import './newTask.scss'
import { useNavigate } from 'react-router-dom'

export const NewTask = () => {
  type Lists = [
    {
      id: string
      title: string
    },
  ]
  const [selectListId, setSelectListId] = useState<string>('')
  const [lists, setLists] = useState<Lists>([{ id: '', title: '' }])
  const [title, setTitle] = useState<string>('')
  const [detail, setDetail] = useState<string>('')
  const [limit, setLimit] = useState<string>('2023-12-04T12:34:56')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [cookies] = useCookies<string>()
  const navigate = useNavigate()

  const handleTitleChange = (e: React.FormEvent<HTMLInputElement>) =>
    setTitle((e.target as HTMLInputElement).value)
  const handleDetailChange = (e: any) =>
    setDetail((e.target as HTMLInputElement).value)
  const handleSelectList = (id: string) => setSelectListId(id)
  // 期限日時
  const handleLimitChange = (e: any) => {
    setLimit(e.target.value)
  }

  const onCreateTask = () => {
    const formatLimit = limit + 'Z'
    const data = {
      title: title,
      detail: detail,
      done: false,
      limit: formatLimit,
    }

    axios
      .post(`${url}/lists/${selectListId}/tasks`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/')
      })
      .catch((err) => {
        setErrorMessage(`タスクの作成に失敗しました。${err}`)
      })
  }

  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data)
        setSelectListId(res.data[0]?.id)
      })
      .catch((err: string) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`)
      })
  }, [])

  return (
    <div>
      <Header />
      <main className="new-task">
        <h2 className="title">タスク新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="new-task-form">
          <label>リスト</label>
          <br />
          <select
            onChange={(e) => handleSelectList(e.target.value)}
            className="new-task-select-list"
          >
            {lists.map((list: any, key: number) => (
              <option key={key} className="list-item" value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
          <br />
          <label>タイトル</label>
          <br />
          <input
            type="text"
            onChange={handleTitleChange}
            className="new-task-title"
          />
          <br />
          <label>詳細</label>
          <br />
          <textarea onChange={handleDetailChange} className="new-task-detail" />
          <br />

          {/* 期限の追加 */}
          <label>期限日時</label>
          <br />
          <input
            type="datetime-local"
            onChange={handleLimitChange}
            className="new-task-limit"
            value={limit}
          />
          <br />

          <button
            type="button"
            className="new-task-button"
            onClick={onCreateTask}
          >
            作成
          </button>
        </form>
      </main>
    </div>
  )
}
