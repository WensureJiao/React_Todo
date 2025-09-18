import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { FormField } from '../ui/FormField'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface FormData {
  title: string
  subtitle: string
  description: string
  startTime: Date | undefined
  endTime: Date | undefined
  status: 'waiting' | 'progress' | 'done'
}

interface TodoFormFieldsProps {
  formData: FormData
  errors: Record<string, string>
  isStartCalendarOpen: boolean
  isEndCalendarOpen: boolean
  onInputChange: (field: keyof FormData, value: string | Date | undefined) => void
  onTimeSelect: (field: 'startTime' | 'endTime', date: Date | undefined) => void
  onTimeInput: (field: 'startTime' | 'endTime', timeString: string) => void
  onStartCalendarOpenChange: (open: boolean) => void
  onEndCalendarOpenChange: (open: boolean) => void
}

export function TodoFormFields({
  formData,
  errors,
  isStartCalendarOpen,
  isEndCalendarOpen,
  onInputChange,
  onTimeSelect,
  onTimeInput,
  onStartCalendarOpenChange,
  onEndCalendarOpenChange
}: TodoFormFieldsProps) {
  const formatTimeDisplay = (date: Date | undefined, defaultTime: string) => {
    if (!date) return defaultTime
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <FormField label="标题" required error={errors.title}>
        <Input
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder="输入待办事项标题"
          className={cn(errors.title && 'border-destructive')}
        />
      </FormField>

      <FormField label="副标题">
        <Input
          value={formData.subtitle}
          onChange={(e) => onInputChange('subtitle', e.target.value)}
          placeholder="输入副标题（可选）"
        />
      </FormField>

      <FormField label="描述" error={errors.description}>
        <Textarea
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="输入待办事项描述（可选）"
          rows={4}
          className={cn(errors.description && 'border-destructive')}
        />
      </FormField>

      <FormField label="状态">
        <Select
          value={formData.status}
          onValueChange={(value: 'waiting' | 'progress' | 'done') => 
            onInputChange('status', value)
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
      </FormField>

      <FormField label="开始时间" error={errors.startTime}>
        <Popover open={isStartCalendarOpen} onOpenChange={onStartCalendarOpenChange}>
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
              onSelect={(date) => onTimeSelect('startTime', date)}
              initialFocus
            />
            <div className="p-3 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">时间:</label>
                  <input
                    type="time"
                    value={formatTimeDisplay(formData.startTime, '09:00')}
                    onChange={(e) => onTimeInput('startTime', e.target.value)}
                    className="px-2 py-1 border rounded text-sm bg-background text-foreground"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onStartCalendarOpenChange(false)}
                >
                  完成
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </FormField>

      <FormField label="结束时间" error={errors.endTime}>
        <Popover open={isEndCalendarOpen} onOpenChange={onEndCalendarOpenChange}>
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
              onSelect={(date) => onTimeSelect('endTime', date)}
              disabled={(date) => {
                if (!formData.startTime) return false
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
                    value={formatTimeDisplay(formData.endTime, '18:00')}
                    onChange={(e) => onTimeInput('endTime', e.target.value)}
                    className="px-2 py-1 border rounded text-sm bg-background text-foreground"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEndCalendarOpenChange(false)}
                >
                  完成
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </FormField>
    </div>
  )
}
