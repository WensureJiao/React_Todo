import { useTodoStore } from '../store/todoStore'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Calendar, Clock, Trash2, Edit, AlertCircle, Sun, Moon } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useTheme } from '../contexts/ThemeContext'

export function TodoList() {
  const {
    getFilteredTodos,
    sortBy,
    setSortBy,
    updateTodoStatus,
    deleteTodo,
    setSelectedTodo,
    setIsEditing,
    clearAll,
    getWaitingTodosCount,
    getProgressTodosCount,
    getTotalTodosCount,
  } = useTodoStore()

  const filteredTodos = getFilteredTodos()
  const waitingTodosCount = getWaitingTodosCount()
  const progressTodosCount = getProgressTodosCount()
  const totalTodosCount = getTotalTodosCount()

  const { theme, setTheme } = useTheme()

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // 获取状态标签
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting':
        return '等待中'
      case 'progress':
        return '进行中'
      case 'done':
        return '已完成'
      default:
        return '未知状态'
    }
  }

  // 检查是否过期
  const isOverdue = (endTime?: Date) => {
    if (!endTime) return false
    const todo = filteredTodos.find(todo => todo.endTime === endTime)
    return endTime < new Date() && todo?.status !== 'done'
  }

  // 格式化日期
  const formatDate = (date: Date) => {
    return format(date, 'MM月dd日 HH:mm', { locale: zhCN })
  }


  // 清空所有待办事项
  const handleClearAll = () => {
    if (confirm('确定要清空所有待办事项吗？此操作不可撤销！')) {
      clearAll()
      alert('所有待办事项已清空！')
    }
  }

  return (
    <div className="h-full flex bg-white">
      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 头部 */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">待办事项</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                {theme === 'light' ? '深色主题' : '浅色主题'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={totalTodosCount === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                清空列表
              </Button>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="text-sm text-gray-500 mb-4">
            共 {totalTodosCount} 项，等待 {waitingTodosCount} 项，进行中 {progressTodosCount} 项
            <br />
            <span className="text-xs text-red-500">调试：totalTodosCount = {totalTodosCount}, disabled = {totalTodosCount === 0 ? 'true' : 'false'}</span>
          </div>


          {/* 排序 */}
          <div className="flex gap-3">
            <Select 
              value={sortBy} 
              onValueChange={(value: 'title' | 'startTime' | 'status') => setSortBy(value)}
              disabled={totalTodosCount === 0}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">按标题排序</SelectItem>
                <SelectItem value="startTime">按开始时间排序</SelectItem>
                <SelectItem value="status">按状态排序</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 待办事项列表 */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Calendar className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">暂无待办事项</p>
              <p className="text-sm mt-2 mb-4">点击右侧添加新的待办事项</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map((todo, index) => (
                <div
                  key={todo.id}
                  className={`group p-4 rounded-lg border transition-all duration-200 hover:shadow-md animate-in slide-in-from-top-2 ${
                    todo.status === 'done' 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* 状态选择器 */}
                    <Select
                      value={todo.status}
                      onValueChange={(value: 'waiting' | 'progress' | 'done') => updateTodoStatus(todo.id, value)}
                    >
                      <SelectTrigger className="w-24 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="waiting">等待</SelectItem>
                        <SelectItem value="progress">进行</SelectItem>
                        <SelectItem value="done">完成</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* 内容区域 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`font-medium ${
                            todo.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}>
                            {todo.title}
                          </h3>
                          
                          {todo.subtitle && (
                            <p className={`text-sm mt-1 ${
                              todo.status === 'done' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {todo.subtitle}
                            </p>
                          )}
                          
                          {todo.description && (
                            <p className={`text-sm mt-1 ${
                              todo.status === 'done' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {todo.description}
                            </p>
                          )}

                          {/* 标签和日期 */}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getStatusColor(todo.status)}`}
                            >
                              {getStatusLabel(todo.status)}
                            </Badge>

                            {todo.startTime && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                开始: {formatDate(todo.startTime)}
                              </div>
                            )}

                            {todo.endTime && (
                              <div className={`flex items-center gap-1 text-xs ${
                                isOverdue(todo.endTime) ? 'text-red-600' : 'text-gray-500'
                              }`}>
                                <Clock className="w-3 h-3" />
                                结束: {formatDate(todo.endTime)}
                                {isOverdue(todo.endTime) && (
                                  <AlertCircle className="w-3 h-3 text-red-500" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTodo(todo)
                              setIsEditing(true)
                            }}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm('确定要删除这个待办事项吗？')) {
                                deleteTodo(todo.id)
                              }
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}