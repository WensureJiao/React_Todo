import { useTodoStore } from '../store/todoStore'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Trash2, Moon, Sun, RotateCcw } from 'lucide-react'

export function Settings() {
  const { 
    getTotalTodosCount,
    getWaitingTodosCount,
    getProgressTodosCount,
    getDoneTodosCount,
    clearAll 
  } = useTodoStore()

  const totalTodosCount = getTotalTodosCount()
  const waitingTodosCount = getWaitingTodosCount()
  const progressTodosCount = getProgressTodosCount()
  const doneTodosCount = getDoneTodosCount()

  const handleClearAll = () => {
    if (confirm('确定要清空所有待办事项吗？此操作不可撤销！')) {
      clearAll()
      alert('所有待办事项已清空！')
    }
  }

  return (
    <div className="h-full bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">设置</h1>
        
        <div className="space-y-6">
          {/* 统计信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                统计信息
              </CardTitle>
              <CardDescription>
                查看你的待办事项统计
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{totalTodosCount}</div>
                  <div className="text-sm text-gray-600">总计</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{waitingTodosCount}</div>
                  <div className="text-sm text-yellow-600">等待中</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{progressTodosCount}</div>
                  <div className="text-sm text-blue-600">进行中</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{doneTodosCount}</div>
                  <div className="text-sm text-green-600">已完成</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 主题设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="w-5 h-5" />
                主题设置
              </CardTitle>
              <CardDescription>
                选择你喜欢的主题模式
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  浅色主题
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  深色主题
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                主题切换功能即将推出
              </p>
            </CardContent>
          </Card>

          {/* 数据管理 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                数据管理
              </CardTitle>
              <CardDescription>
                管理你的待办事项数据
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">清空所有数据</h4>
                  <p className="text-sm text-red-700 mb-3">
                    这将删除所有待办事项，此操作不可撤销。
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleClearAll}
                    disabled={totalTodosCount === 0}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    清空所有待办事项
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 关于 */}
          <Card>
            <CardHeader>
              <CardTitle>关于应用</CardTitle>
              <CardDescription>
                待办事项管理应用
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>版本：1.0.0</p>
                <p>技术栈：React + TypeScript + Tailwind CSS + Zustand + Shadcn/ui</p>
                <p>基于 Flutter TODO List 模板重新设计</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}