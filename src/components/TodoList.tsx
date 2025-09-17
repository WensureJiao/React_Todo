import { useTodoStore } from '../store/todoStore'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Calendar, Clock, Trash2, Edit, AlertCircle, Sun, Moon } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useTheme } from '../contexts/ThemeContext'
import { cn } from '@/lib/utils'

const statusConfig = {
  waiting: {
    label: '等待中',
    badgeClass: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200',
    cardClass: 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700',
    textClass: 'text-gray-700 dark:text-gray-300',
    titleClass: 'text-gray-900 dark:text-gray-100',
    subtitleClass: 'text-gray-600 dark:text-gray-400'
  },
  progress: {
    label: '进行中',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-700 dark:text-blue-200',
    cardClass: 'bg-blue-50 border-blue-200 hover:border-blue-300 hover:bg-blue-100 dark:bg-blue-900 dark:border-blue-600 dark:hover:bg-blue-800',
    textClass: 'text-blue-700 dark:text-blue-300',
    titleClass: 'text-blue-900 dark:text-blue-100',
    subtitleClass: 'text-blue-600 dark:text-blue-400'
  },
  done: {
    label: '已完成',
    badgeClass: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-700 dark:text-green-200',
    cardClass: 'bg-green-50 border-green-200 hover:border-green-300 hover:bg-green-100 dark:bg-green-900 dark:border-green-600 dark:hover:bg-green-800',
    textClass: 'text-green-700 dark:text-green-300',
    titleClass: 'text-green-900 dark:text-green-100',
    subtitleClass: 'text-green-600 dark:text-green-400'
  }
}

export function TodoList() {
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
  } = useTodoStore()

  const { theme, setTheme } = useTheme()
  const todos = getFilteredTodos()
  const counts = getTodosCount()

  // 检查是否过期
  const isOverdue = (endTime?: Date) => {
    if (!endTime) return false
    return endTime < new Date() && todos.find(todo => todo.endTime === endTime)?.status !== 'done'
  }

  // 格式化日期
  const formatDate = (date: Date) => {
    return format(date, 'MM月dd日 HH:mm', { locale: zhCN })
  }

  // 清空所有待办事项
  const handleClearAll = () => {
    if (confirm('确定要清空所有待办事项吗？此操作不可撤销！')) {
      clearAll()
    }
  }

  return (
    <div className="h-full flex bg-background">
      <div className="flex-1 flex flex-col">
        {/* 头部 */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">待办事项</h2>
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
                disabled={counts.total === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                清空列表
              </Button>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="text-sm text-muted-foreground mb-4">
            共 {counts.total} 项，等待 {counts.waiting} 项，进行中 {counts.progress} 项
          </div>

          {/* 排序 */}
          <div className="flex gap-3">
            <Select 
              value={sortBy} 
              onValueChange={(value: 'title' | 'startTime' | 'status') => setSortBy(value)}
              disabled={counts.total === 0}
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
          {todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Calendar className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">暂无待办事项</p>
              <p className="text-sm mt-2 mb-4">点击右侧添加新的待办事项</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo, index) => {
                const config = statusConfig[todo.status]
                return (
                  <div
                    key={todo.id}
                    className={cn(
                      "group p-4 rounded-lg border transition-all duration-200 hover:shadow-md animate-in slide-in-from-top-2",
                      config.cardClass,
                      todo.status === 'done' && 'opacity-75'
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* 状态选择器 */}
                      <Select
                        value={todo.status}
                        onValueChange={(value: 'waiting' | 'progress' | 'done') => 
                          updateTodo(todo.id, { status: value })
                        }
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
                            <h3 className={cn(
                              "font-medium",
                              config.titleClass,
                              todo.status === 'done' && 'line-through opacity-60'
                            )}>
                              {todo.title}
                            </h3>
                            
                            {todo.subtitle && (
                              <p className={cn(
                                "text-sm mt-1",
                                config.subtitleClass,
                                todo.status === 'done' && 'opacity-60'
                              )}>
                                {todo.subtitle}
                              </p>
                            )}
                            
                            {todo.description && (
                              <p className={cn(
                                "text-sm mt-1",
                                config.subtitleClass,
                                todo.status === 'done' && 'opacity-60'
                              )}>
                                {todo.description}
                              </p>
                            )}

                            {/* 标签和日期 */}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge 
                                variant="outline" 
                                className={cn("text-xs", config.badgeClass)}
                              >
                                {config.label}
                              </Badge>

                              {todo.startTime && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  开始: {formatDate(todo.startTime)}
                                </div>
                              )}

                              {todo.endTime && (
                                <div className={cn(
                                  "flex items-center gap-1 text-xs",
                                  isOverdue(todo.endTime) ? 'text-destructive' : 'text-muted-foreground'
                                )}>
                                  <Clock className="w-3 h-3" />
                                  结束: {formatDate(todo.endTime)}
                                  {isOverdue(todo.endTime) && (
                                    <AlertCircle className="w-3 h-3 text-destructive" />
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
                              className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-300"
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
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}