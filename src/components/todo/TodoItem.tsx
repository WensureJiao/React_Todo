import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Clock, Edit, Trash2, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { statusConfig } from '../../config/status-config'
import { type Todo } from '../../store/todoStore'

interface TodoItemProps {
  todo: Todo
  index: number
  onStatusChange: (id: string, status: 'waiting' | 'progress' | 'done') => void
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, index, onStatusChange, onEdit, onDelete }: TodoItemProps) {
  const config = statusConfig[todo.status]
  
  // 检查是否过期
  const isOverdue = (endTime?: Date) => {
    if (!endTime) return false
    return endTime < new Date() && todo.status !== 'done'
  }

  // 格式化日期
  const formatDate = (date: Date) => {
    return format(date, 'MM月dd日 HH:mm', { locale: zhCN })
  }

  return (
    <div
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
            onStatusChange(todo.id, value)
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
                onClick={() => onEdit(todo)}
                className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-300"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(todo.id)}
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
}
