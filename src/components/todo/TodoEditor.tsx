import { useState, useEffect } from 'react'
import { useTodoStore } from '../../store/todoStore'
import { Button } from '../ui/button'
import { Plus, Save, X } from 'lucide-react'
import { TodoFormFields } from './TodoFormFields'

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

export function TodoEditor() {
  const {
    selectedTodo,
    isEditing,
    addTodo,
    updateTodo,
    setSelectedTodo,
    setIsEditing,
  } = useTodoStore()

  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false)
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false)

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
      setFormData(initialFormData)
    }
    setErrors({})
  }, [selectedTodo, isEditing])

  const handleCancel = () => {
    setFormData(initialFormData)
    setErrors({})
    setSelectedTodo(null)
    setIsEditing(false)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = '标题不能为空'
    } else if (formData.title.length > 100) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('表单提交', formData)
    
    if (!validateForm()) {
      console.log('表单验证失败', errors)
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

    console.log('准备添加待办事项', todoData)

    if (isEditing && selectedTodo) {
      updateTodo(selectedTodo.id, todoData)
    } else {
      addTodo(todoData)
    }
    handleCancel()
  }

  const handleInputChange = (field: keyof FormData, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleTimeSelect = (field: 'startTime' | 'endTime', date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date)
      const currentTime = formData[field]
      if (currentTime) {
        newDate.setHours(currentTime.getHours())
        newDate.setMinutes(currentTime.getMinutes())
      } else {
        newDate.setHours(field === 'startTime' ? 9 : 18, 0)
      }
      handleInputChange(field, newDate)
    }
  }

  const handleTimeInput = (field: 'startTime' | 'endTime', timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number)
    const baseDate = formData[field] || new Date()
    const newDate = new Date(baseDate)
    newDate.setHours(hours, minutes)
    handleInputChange(field, newDate)
  }


  return (
    <div className="h-full flex flex-col bg-background rounded-lg shadow-sm border">
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

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 p-6">
          <TodoFormFields
            formData={formData}
            errors={errors}
            isStartCalendarOpen={isStartCalendarOpen}
            isEndCalendarOpen={isEndCalendarOpen}
            onInputChange={handleInputChange}
            onTimeSelect={handleTimeSelect}
            onTimeInput={handleTimeInput}
            onStartCalendarOpenChange={setIsStartCalendarOpen}
            onEndCalendarOpenChange={setIsEndCalendarOpen}
          />
        </div>

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
