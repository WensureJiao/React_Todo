import { useState, useEffect } from 'react'
import { useTodoStore } from '../store/todoStore'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { CalendarIcon, Plus, Save, X } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export function TodoEditor() {
  const {
    selectedTodo,
    isEditing,
    addTodo,
    updateTodo,
    setSelectedTodo,
    setIsEditing,
  } = useTodoStore()

  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    startTime: undefined as Date | undefined,
    endTime: undefined as Date | undefined,
    status: 'waiting' as 'waiting' | 'progress' | 'done',
  })

  // 日期选择器状态
  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false)
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false)
  
  // 日历显示的月份状态
  const [startCalendarMonth, setStartCalendarMonth] = useState<Date>(new Date())
  const [endCalendarMonth, setEndCalendarMonth] = useState<Date>(new Date())

  // 表单验证
  const [errors, setErrors] = useState<Record<string, string>>({})

  // 当选中待办事项变化时，更新表单数据
  useEffect(() => {
    if (selectedTodo && isEditing) {
      setFormData({
        title: selectedTodo.title,
        subtitle: selectedTodo.subtitle || '',
        description: selectedTodo.description || '',
        startTime: selectedTodo.startTime,
        endTime: selectedTodo.endTime,
        status: selectedTodo.status,
      })
    } else {
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        startTime: undefined,
        endTime: undefined,
        status: 'waiting',
      })
    }
    setErrors({})
  }, [selectedTodo, isEditing])

  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = '标题不能为空'
    }
    
    if (formData.title.length > 100) {
      newErrors.title = '标题不能超过100个字符'
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = '描述不能超过500个字符'
    }
    
    if (formData.startTime && formData.endTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = '结束时间必须晚于开始时间'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const todoData = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim() || undefined,
      description: formData.description.trim() || undefined,
      startTime: formData.startTime,
      endTime: formData.endTime,
      status: formData.status,
    }

    if (isEditing && selectedTodo) {
      // 更新现有待办事项
      updateTodo(selectedTodo.id, todoData)
      // 显示成功提示
      alert('待办事项已更新！')
    } else {
      // 添加新待办事项
      addTodo(todoData)
      // 显示成功提示
      alert('待办事项已添加！')
    }

    // 重置表单
    handleCancel()
  }

  // 处理取消
  const handleCancel = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      startTime: undefined,
      endTime: undefined,
      status: 'waiting',
    })
    setErrors({})
    setSelectedTodo(null)
    setIsEditing(false)
  }

  // 处理输入变化
  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'Enter' && formData.title.trim()) {
          handleSubmit(e as unknown as React.FormEvent)
        } else if (e.key === 'Escape') {
          handleCancel()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [formData.title])

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border">
      {/* 头部 */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? '编辑待办事项' : '添加待办事项'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标题 *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="输入待办事项标题"
              className={cn(errors.title && 'border-red-500')}
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          {/* 副标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              副标题
            </label>
            <Input
              value={formData.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              placeholder="输入副标题（可选）"
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              描述
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="输入待办事项描述（可选）"
              rows={4}
              className={cn(errors.description && 'border-red-500')}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          {/* 状态 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              状态
            </label>
            <Select
              value={formData.status}
              onValueChange={(value: 'waiting' | 'progress' | 'done') => handleInputChange('status', value)}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              开始时间
            </label>
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
                    format(formData.startTime, "yyyy年MM月dd日", { locale: zhCN })
                  ) : (
                    "选择开始时间（可选）"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.startTime}
                  month={startCalendarMonth}
                  onMonthChange={setStartCalendarMonth}
                  onSelect={(date) => {
                    if (date) {
                      // 保持原有的时间，只更新日期
                      const newDate = new Date(date)
                      if (formData.startTime) {
                        newDate.setHours(formData.startTime.getHours())
                        newDate.setMinutes(formData.startTime.getMinutes())
                      } else {
                        newDate.setHours(9, 0) // 默认9:00
                      }
                      handleInputChange('startTime', newDate)
                    }
                    setIsStartCalendarOpen(false)
                  }}
                  disabled={(date) => {
                    // 根据当前日历显示的月份来限制选择
                    const displayMonth = startCalendarMonth.getMonth()
                    const displayYear = startCalendarMonth.getFullYear()
                    return date.getMonth() !== displayMonth || date.getFullYear() !== displayYear
                  }}
                  initialFocus
                />
                {formData.startTime && (
                  <div className="p-3 border-t">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">时间:</label>
                      <input
                        type="time"
                        value={formData.startTime ? `${formData.startTime.getHours().toString().padStart(2, '0')}:${formData.startTime.getMinutes().toString().padStart(2, '0')}` : ''}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':').map(Number)
                          const newDate = new Date(formData.startTime!)
                          newDate.setHours(hours, minutes)
                          handleInputChange('startTime', newDate)
                        }}
                        className="px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            {formData.startTime && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleInputChange('startTime', undefined)}
                className="mt-2 text-red-600 hover:text-red-700"
              >
                清除开始时间
              </Button>
            )}
          </div>

          {/* 结束时间 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              结束时间
            </label>
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
                    format(formData.endTime, "yyyy年MM月dd日", { locale: zhCN })
                  ) : (
                    "选择结束时间（可选）"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.endTime}
                  month={endCalendarMonth}
                  onMonthChange={setEndCalendarMonth}
                  onSelect={(date) => {
                    if (date) {
                      // 保持原有的时间，只更新日期
                      const newDate = new Date(date)
                      if (formData.endTime) {
                        newDate.setHours(formData.endTime.getHours())
                        newDate.setMinutes(formData.endTime.getMinutes())
                      } else {
                        newDate.setHours(18, 0) // 默认18:00
                      }
                      handleInputChange('endTime', newDate)
                    }
                    setIsEndCalendarOpen(false)
                  }}
                  disabled={(date) => {
                    // 根据当前日历显示的月份来限制选择
                    const displayMonth = endCalendarMonth.getMonth()
                    const displayYear = endCalendarMonth.getFullYear()
                    const isNotDisplayMonth = date.getMonth() !== displayMonth || date.getFullYear() !== displayYear
                    const isBeforeStart = formData.startTime ? date < formData.startTime : false
                    return isNotDisplayMonth || isBeforeStart
                  }}
                  initialFocus
                />
                {formData.endTime && (
                  <div className="p-3 border-t">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">时间:</label>
                      <input
                        type="time"
                        value={formData.endTime ? `${formData.endTime.getHours().toString().padStart(2, '0')}:${formData.endTime.getMinutes().toString().padStart(2, '0')}` : ''}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':').map(Number)
                          const newDate = new Date(formData.endTime!)
                          newDate.setHours(hours, minutes)
                          handleInputChange('endTime', newDate)
                        }}
                        className="px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            {formData.endTime && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleInputChange('endTime', undefined)}
                className="mt-2 text-red-600 hover:text-red-700"
              >
                清除结束时间
              </Button>
            )}
            {errors.endTime && (
              <p className="text-sm text-red-600 mt-1">{errors.endTime}</p>
            )}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1"
              disabled={!formData.title.trim()}
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
