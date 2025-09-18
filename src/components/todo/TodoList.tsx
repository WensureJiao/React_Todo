
import { useTodoStore } from '../../store/todoStore'
import { useThemeStore } from '../../store/themeStore'
import { Calendar } from 'lucide-react'
import { TodoListHeader } from './TodoListHeader'
import { TodoItem } from './TodoItem'

export function TodoList() {
  /// 1. 状态管理 - 从Zustand获取数据和方法
  const {
    getFilteredTodos,
    sortBy,
    setSortBy,
    updateTodo,
    deleteTodo,
    setSelectedTodo,
    setIsEditing,
    clearAll,
    getTodosCount,
    addRandomTodo,
  } = useTodoStore()
  
  /// 2. 主题管理 - 从Zustand获取数据和方法
  const { theme, toggleTheme } = useThemeStore()
  
  /// 3. 数据和方法
  const todos = getFilteredTodos()
  const counts = getTodosCount()


  // 清空所有待办事项
  const handleClearAll = () => {
    if (confirm('确定要清空所有待办事项吗？此操作不可撤销！')) {
      clearAll()
    }
  }

  // 处理编辑
  const handleEdit = (todo: { id: string; title: string; subtitle?: string; description?: string; startTime?: Date; endTime?: Date; status: 'waiting' | 'progress' | 'done'; createdAt: Date; updatedAt: Date }) => {
    setSelectedTodo(todo)
    setIsEditing(true)
  }

  // 处理删除
  const handleDelete = (todoId: string) => {
    if (confirm('确定要删除这个待办事项吗？')) {
      deleteTodo(todoId)
    }
  }

  return (
    <div className="h-full flex bg-background">
      <div className="flex-1 flex flex-col">
        <TodoListHeader
          counts={counts}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onAddRandom={addRandomTodo}
          onToggleTheme={toggleTheme}
          onClearAll={handleClearAll}
          theme={theme}
        />

        {/* 待办事项列表 */}
        <div className="flex-1 overflow-y-auto p-6">
          {todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Calendar className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">暂无待办事项</p>
              <p className="text-sm mt-2 mb-4">点击右侧添加新的待办事项</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo, index) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  index={index}
                  onStatusChange={(id, status) => updateTodo(id, { status })}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}