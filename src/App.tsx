
import { TodoList } from './components/todo/TodoList'
import { TodoEditor } from './components/todo/TodoEditor'

function App() {
  return (
    <div className="h-screen bg-background flex">
      {/* 左侧：待办事项列表 */}
      <div className="flex-1">
        <TodoList />
      </div>

      {/* 右侧：添加/编辑待办事项 */}
      <div className="flex-1">
        <TodoEditor />
      </div>
    </div>
  )
}

export default App
