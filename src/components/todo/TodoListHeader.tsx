import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Shuffle, Moon, Sun, Trash2 } from 'lucide-react'

interface TodoListHeaderProps {
  counts: { waiting: number; progress: number; done: number; total: number }
  sortBy: 'title' | 'startTime' | 'status'
  onSortChange: (value: 'title' | 'startTime' | 'status') => void
  onAddRandom: () => void
  onToggleTheme: () => void
  onClearAll: () => void
  theme: 'light' | 'dark'
}

export function TodoListHeader({
  counts,
  sortBy,
  onSortChange,
  onAddRandom,
  onToggleTheme,
  onClearAll,
  theme
}: TodoListHeaderProps) {
  return (
    <div className="p-6 border-b">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">待办事项</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddRandom}
          >
            <Shuffle className="w-4 h-4 mr-2" />
            随机生成
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleTheme}
          >
            {theme === 'light' ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
            {theme === 'light' ? '深色主题' : '浅色主题'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
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
          onValueChange={onSortChange}
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
  )
}
