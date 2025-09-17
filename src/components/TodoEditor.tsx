import { useState, useEffect } from 'react'
import { useTodoStore } from '../store/todoStore'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
/// 1. 图标
import { CalendarIcon, Plus, Save, X } from 'lucide-react'
/// 2. 日期格式化
import { format } from 'date-fns'
/// 3. 本地化
import { zhCN } from 'date-fns/locale'
/// 4. 工具函数
import { cn } from '@/lib/utils'

interface FormData {
  title: string
  subtitle: string
  description: string
  startTime: Date | undefined
  endTime: Date | undefined
  status: 'waiting' | 'progress' | 'done'
}

const initialFormData: FormData = {
  title: '',
  subtitle: '',
  description: '',
  startTime: undefined,
  endTime: undefined,
  status: 'waiting',
}
///全局状态
export function TodoEditor() {
  const {
    selectedTodo,    // 当前选中的待办事项
    isEditing,       // 是否处于编辑模式
    addTodo,         // 添加待办事项
    updateTodo,      // 更新待办事项
    setSelectedTodo, // 设置选中的待办事项
    setIsEditing,    // 设置编辑模式
  } = useTodoStore()
//本地状态
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false)
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false)

  // 同步选中待办事项到表单
  useEffect(() => {
    if (selectedTodo && isEditing) {
      ///同步选中待办事项到表单
      setFormData({
        title: selectedTodo.title,
        subtitle: selectedTodo.subtitle || '',
        description: selectedTodo.description || '',
        startTime: selectedTodo.startTime,
        endTime: selectedTodo.endTime,
        status: selectedTodo.status,
      })
    } else {
      ///新增模式，重置表单
      setFormData(initialFormData)
    }
    setErrors({}) ///重置错误信息
  }, [selectedTodo, isEditing])

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    ///标题不能为空
    if (!formData.title.trim()) {
      newErrors.title = '标题不能为空'
    } else if (formData.title.length > 100) {
      newErrors.title = '标题不能超过100个字符'
    }
    ///描述不能超过500个字符
    if (formData.description && formData.description.length > 500) {
      newErrors.description = '描述不能超过500个字符'
    }
    ///结束时间必须晚于开始时间
    if (formData.startTime && formData.endTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = '结束时间必须晚于开始时间'
    }
    
    setErrors(newErrors)
    ///如果没有任何错误，返回 true
    return Object.keys(newErrors).length === 0
  }

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    ///阻止默认行为
    e.preventDefault()
    ///如果表单验证不通过，返回
    if (!validateForm()) return
///创建待办事项数据
    const todoData = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim() || undefined,
      description: formData.description.trim() || undefined,
      startTime: formData.startTime,
      endTime: formData.endTime,
      status: formData.status,
    }
///编辑模式，更新待办事项
    if (isEditing && selectedTodo) {
      updateTodo(selectedTodo.id, todoData)
    } else {
      ///新增模式，添加待办事项
      addTodo(todoData)
    }
///取消编辑模式
    handleCancel()
  }

  // 处理取消
  const handleCancel = () => {
    setFormData(initialFormData)
    setErrors({})
    setSelectedTodo(null)
    setIsEditing(false)
  }

  // 处理输入变化
  const handleInputChange = (field: keyof FormData, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // 处理时间选择
  const handleTimeSelect = (field: 'startTime' | 'endTime', date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date)
      const currentTime = formData[field]
      if (currentTime) {
        /// 如果之前已经有时间，就沿用之前的“时分”，只更新年月日
        newDate.setHours(currentTime.getHours())
        newDate.setMinutes(currentTime.getMinutes())
      } else {
        /// 如果之前没有时间，就默认设置为开始时间9点，结束时间18点
        newDate.setHours(field === 'startTime' ? 9 : 18, 0)
      }
      ///更新表单
      handleInputChange(field, newDate)
    }
  }

  // 处理时间输入
  const handleTimeInput = (field: 'startTime' | 'endTime', timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number)
    const baseDate = formData[field] || new Date()
    const newDate = new Date(baseDate)
    newDate.setHours(hours, minutes)
    handleInputChange(field, newDate)
  }

  return (
    <div className="h-full flex flex-col bg-background rounded-lg shadow-sm border">
      {/* 头部 */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {isEditing ? '编辑待办事项' : '添加待办事项'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              快捷键：Ctrl+Enter 保存，Esc 取消
            </p>
          </div>
          {isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 p-6 space-y-6">
          {/* 标题 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">标题 *</label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="输入待办事项标题"
              className={cn(errors.title && 'border-destructive')}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* 副标题 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">副标题</label>
            <Input
              value={formData.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              placeholder="输入副标题（可选）"
            />
          </div>

          {/* 描述 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">描述</label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="输入待办事项描述（可选）"
              rows={4}
              className={cn(errors.description && 'border-destructive')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* 状态 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">状态</label>
            <Select
              value={formData.status}
              onValueChange={(value: 'waiting' | 'progress' | 'done') => 
                handleInputChange('status', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="waiting">等待中</SelectItem>
                <SelectItem value="progress">进行中</SelectItem>
                <SelectItem value="done">已完成</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 开始时间 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">开始时间</label>
            <Popover open={isStartCalendarOpen} onOpenChange={setIsStartCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.startTime && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startTime ? (
                    format(formData.startTime, "yyyy年MM月dd日 HH:mm", { locale: zhCN })
                  ) : (
                    "选择开始时间（可选）"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.startTime}
                  onSelect={(date) => handleTimeSelect('startTime', date)}
                  initialFocus
                />
                <div className="p-3 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">时间:</label>
                      <input
                        type="time"
                        value={formData.startTime ? 
                          `${formData.startTime.getHours().toString().padStart(2, '0')}:${formData.startTime.getMinutes().toString().padStart(2, '0')}` : 
                          '09:00'
                        }
                        onChange={(e) => handleTimeInput('startTime', e.target.value)}
                        className="px-2 py-1 border rounded text-sm bg-background text-foreground"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsStartCalendarOpen(false)}
                    >
                      完成
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* 结束时间 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">结束时间</label>
            <Popover open={isEndCalendarOpen} onOpenChange={setIsEndCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.endTime && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.endTime ? (
                    format(formData.endTime, "yyyy年MM月dd日 HH:mm", { locale: zhCN })
                  ) : (
                    "选择结束时间（可选）"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.endTime}
                  onSelect={(date) => handleTimeSelect('endTime', date)}
                  disabled={(date) => {
                    if (!formData.startTime) return false
                    // 只禁用开始时间之前的日期，同一天允许选择
                    const startDate = new Date(formData.startTime)
                    startDate.setHours(0, 0, 0, 0)
                    const compareDate = new Date(date)
                    compareDate.setHours(0, 0, 0, 0)
                    return compareDate < startDate
                  }}
                  initialFocus
                />
                <div className="p-3 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">时间:</label>
                      <input
                        type="time"
                        value={formData.endTime ? 
                          `${formData.endTime.getHours().toString().padStart(2, '0')}:${formData.endTime.getMinutes().toString().padStart(2, '0')}` : 
                          '18:00'
                        }
                        onChange={(e) => handleTimeInput('endTime', e.target.value)}
                        className="px-2 py-1 border rounded text-sm bg-background text-foreground"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEndCalendarOpen(false)}
                    >
                      完成
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {errors.endTime && (
              <p className="text-sm text-destructive">{errors.endTime}</p>
            )}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t bg-muted/50">
          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  保存更改
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  添加待办事项
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              取消
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}