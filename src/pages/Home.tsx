import { useState, useEffect, Key, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { Header } from '../components/Header'
import { url } from '../const'
import './home.scss'

export const Home = () => {
  type Lists = [
    {
      id: string
      title: string
    },
  ]

  type List = {
    id: string
    title: string
  }

  type Tasks = [
    {
      id: string
      title: string
      detail: string
      done: boolean
      limit: string
    },
  ]

  type Task = {
    id: string
    title: string
    detail: string
    done: boolean
    limit: string
  }

  const [isDoneDisplay, setIsDoneDisplay] = useState<string>('todo') // todo->未完了 done->完了
  const [lists, setLists] = useState<Lists>([{ id: '', title: '' }])
  const [selectListId, setSelectListId] = useState<string>('')
  const [tasks, setTasks] = useState<Tasks>([
    { id: '', title: '', detail: '', done: false, limit: '' },
  ])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [cookies] = useCookies<string>()
  const handleIsDoneDisplayChange = (e: {
    target: { value: SetStateAction<string> }
  }) => setIsDoneDisplay(e.target.value)

  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data)
      })
      .catch((err: string) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`)
      })
  }, [])

  useEffect(() => {
    const listId: string = lists[0]?.id
    if (typeof listId !== 'undefined' && listId !== '') {
      setSelectListId(listId)
      axios
        .get(`${url}/lists/${listId}/tasks`, {
          headers: {
            authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((res) => {
          setTasks(res.data.tasks)
          console.log(res)
        })
        .catch((err: string) => {
          setErrorMessage(`タスクの取得に失敗しました。${err}`)
        })
    }
  }, [lists])

  const handleSelectList = (id: string) => {
    setSelectListId(id)
    axios
      .get(`${url}/lists/${id}/tasks`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setTasks(res.data.tasks)
      })
      .catch((err: string) => {
        setErrorMessage(`タスクの取得に失敗しました。${err}`)
      })
  }

  const enterKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const id = (event.target as HTMLButtonElement).dataset.id
    if (event.key === 'Enter') {
      setSelectListId(id)
      handleSelectList(id)
    }
  }

  return (
    <div>
      <Header />
      <main className="taskList">
        <p className="error-message">{errorMessage}</p>
        <div>
          <div className="list-header">
            <h2>リスト一覧</h2>
            <div className="list-menu">
              <p>
                <Link to="/list/new">リスト新規作成</Link>
              </p>
              <p>
                <Link to={`/lists/${selectListId}/edit`}>
                  選択中のリストを編集
                </Link>
              </p>
            </div>
          </div>
          <nav>
            <ul className="list-tab" role="tab-list">
              {lists.map((list: List, key: number) => {
                const isActive = list.id === selectListId
                return (
                  <li
                    key={key}
                    className={`list-tab-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectList(list.id)}
                    onKeyDown={enterKeyDown}
                    tabIndex={key + 1}
                    role="tab"
                    data-id={list.id}
                    aria-controls={`panel-${key}`}
                  >
                    {list.title}
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="tasks">
            <div className="tasks-header">
              <h2>タスク一覧</h2>
              <Link to="/task/new">タスク新規作成</Link>
            </div>
            <div className="display-select-wrapper">
              <select
                onChange={handleIsDoneDisplayChange}
                className="display-select"
              >
                <option value="todo">未完了</option>
                <option value="done">完了</option>
              </select>
            </div>
            <Tasks
              tasks={tasks}
              selectListId={selectListId}
              isDoneDisplay={isDoneDisplay}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

// 表示するタスク
const Tasks = (props: {
  tasks: any
  selectListId: string
  isDoneDisplay: string
}) => {
  const { tasks, selectListId, isDoneDisplay } = props
  if (tasks === null) return <></>

  // 完了の場合
  if (isDoneDisplay == 'done') {
    return (
      <ul>
        {tasks
          .filter((task: { done: boolean }) => {
            return task.done === true
          })
          .map(
            (
              task: {
                id: string
                title: string
                done: boolean
                limit: string
              },
              key: Key
            ) => (
              <li key={key} className="task-item">
                <Link
                  to={`/lists/${selectListId}/tasks/${task.id}`}
                  className="task-item-link"
                >
                  {task.title}
                  <br />
                  {task.done ? '完了' : '未完了'}
                </Link>
              </li>
            )
          )}
      </ul>
    )
  }

  return (
    <ul>
      {tasks
        .filter((task: { done: boolean }) => {
          return task.done === false
        })
        .map(
          (
            task: {
              id: string
              title: string
              done: boolean
              limit: string
            },
            key: number
          ) => {
            // 期限日時
            const utcLimitDate = new Date(
              tasks[key].limit.replace(/Z/, '')
            ).getTime()

            // 現在の日時を取得
            const now = new Date().getTime()
            // 日付と時間の計算
            const distance: number = utcLimitDate - now

            const days: number = Math.floor(distance / (1000 * 60 * 60 * 24))
            const hours: number = Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            )
            const minutes: number = Math.floor(
              (distance % (1000 * 60 * 60)) / (1000 * 60)
            )
            const restDate = days + '日' + hours + '時間' + minutes + '分'

            return (
              <li key={key} className="task-item">
                <Link
                  to={`/lists/${selectListId}/tasks/${task.id}`}
                  className="task-item-link"
                >
                  {task.title}
                  <br />
                  {task.done ? '完了' : '未完了'}
                  <br />
                  期限日時：
                  {task.limit.toLocaleString().replace(/T|:..Z/g, ' ')}
                  <br />
                  残り日時：
                  {restDate}
                </Link>
              </li>
            )
          }
        )}
    </ul>
  )
}
