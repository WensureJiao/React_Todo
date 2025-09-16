import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Todo 数据模型 - 匹配 Flutter 版本
export interface Todo {
  id: string
  title: string
  subtitle?: string
  description?: string
  startTime?: Date
  endTime?: Date
  status: 'waiting' | 'progress' | 'done'
  createdAt: Date
  updatedAt: Date
}

// 排序类型
export type SortType = 'title' | 'startTime' | 'status'

// 状态接口
interface TodoState {
  // 状态
  todos: Todo[]
  sortBy: SortType
  selectedTodo: Todo | null
  isEditing: boolean
  
  // 操作
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTodo: (id: string, updates: Partial<Todo>) => void
  deleteTodo: (id: string) => void
  updateTodoStatus: (id: string, status: 'waiting' | 'progress' | 'done') => void
  setSortBy: (sortBy: SortType) => void
  setSelectedTodo: (todo: Todo | null) => void
  setIsEditing: (editing: boolean) => void
  clearAll: () => void
  
  // 计算属性
  getFilteredTodos: () => Todo[]
  getWaitingTodosCount: () => number
  getProgressTodosCount: () => number
  getDoneTodosCount: () => number
  getTotalTodosCount: () => number
}

// 创建 store
export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      // 初始状态
      todos: [],
      sortBy: 'title',
      selectedTodo: null,
      isEditing: false,
      
      // 添加待办事项
      addTodo: (todoData) => {
        const newTodo: Todo = {
          ...todoData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          todos: [...state.todos, newTodo]
        }))
      },
      
      // 更新待办事项
      updateTodo: (id, updates) => {
        set((state) => ({
          todos: state.todos.map(todo =>
            todo.id === id 
              ? { ...todo, ...updates, updatedAt: new Date() }
              : todo
          )
        }))
      },
      
      // 删除待办事项
      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter(todo => todo.id !== id),
          selectedTodo: state.selectedTodo?.id === id ? null : state.selectedTodo
        }))
      },
      
      // 更新待办事项状态
      updateTodoStatus: (id, status) => {
        set((state) => ({
          todos: state.todos.map(todo =>
            todo.id === id 
              ? { ...todo, status, updatedAt: new Date() }
              : todo
          )
        }))
      },
      
      // 设置排序方式
      setSortBy: (sortBy) => {
        set({ sortBy })
      },
      
      // 设置选中的待办事项
      setSelectedTodo: (todo) => {
        set({ selectedTodo: todo })
      },
      
      // 设置编辑状态
      setIsEditing: (editing) => {
        set({ isEditing: editing })
      },
      
      // 清除所有待办事项
      clearAll: () => {
        set(() => ({
          todos: [],
          selectedTodo: null
        }))
      },
      
      // 计算属性 - 排序后的待办事项
      getFilteredTodos: () => {
        const { todos, sortBy } = get()
        
        // 排序
        return todos.sort((a, b) => {
          switch (sortBy) {
            case 'title':
              return a.title.localeCompare(b.title)
            case 'startTime': {
              if (!a.startTime && !b.startTime) return 0
              if (!a.startTime) return 1
              if (!b.startTime) return -1
              return a.startTime.getTime() - b.startTime.getTime()
            }
            case 'status': {
              // 未完成的放在前面，已完成的放在后面
              const statusOrder = { waiting: 0, progress: 1, done: 2 }
              return statusOrder[a.status] - statusOrder[b.status]
            }
            default:
              return b.createdAt.getTime() - a.createdAt.getTime()
          }
        })
      },
      
      // 计算属性 - 等待中待办事项数量
      getWaitingTodosCount: () => {
        return get().todos.filter(todo => todo.status === 'waiting').length
      },
      
      // 计算属性 - 进行中待办事项数量
      getProgressTodosCount: () => {
        return get().todos.filter(todo => todo.status === 'progress').length
      },
      
      // 计算属性 - 已完成待办事项数量
      getDoneTodosCount: () => {
        return get().todos.filter(todo => todo.status === 'done').length
      },
      
      // 计算属性 - 总待办事项数量
      getTotalTodosCount: () => {
        return get().todos.length
      },
    }),
    {
      name: 'todo-storage',
      partialize: (state) => ({ 
        todos: state.todos,
        sortBy: state.sortBy
      }),
    }
  )
)
