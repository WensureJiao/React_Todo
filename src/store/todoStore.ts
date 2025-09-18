import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateRandomTodo } from '../lib/randomTodoGenerator'

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

export type SortType = 'title' | 'startTime' | 'status'

interface TodoState {
  // 数据
  todos: Todo[]
  sortBy: SortType
  selectedTodo: Todo | null
  isEditing: boolean
  
  // 基础操作
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTodo: (id: string, updates: Partial<Todo>) => void
  deleteTodo: (id: string) => void
  clearAll: () => void
  addRandomTodo: () => void
  
  // UI状态
  setSortBy: (sortBy: SortType) => void
  setSelectedTodo: (todo: Todo | null) => void
  setIsEditing: (editing: boolean) => void
  
  // 计算属性
  getFilteredTodos: () => Todo[]
  getTodosCount: () => { waiting: number; progress: number; done: number; total: number }
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      // 初始状态
      todos: [],
      sortBy: 'title',
      selectedTodo: null,
      isEditing: false,
      
      // 基础操作
      addTodo: (todoData) => {
        const newTodo: Todo = {
          ...todoData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ todos: [...state.todos, newTodo] }))
      },
      
      updateTodo: (id, updates) => {
        set((state) => ({
          todos: state.todos.map(todo =>
            todo.id === id 
              ? { ...todo, ...updates, updatedAt: new Date() }
              : todo
          )
        }))
      },
      
      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter(todo => todo.id !== id),
          selectedTodo: state.selectedTodo?.id === id ? null : state.selectedTodo
        }))
      },
      
      clearAll: () => {
        set({ todos: [], selectedTodo: null })
      },
      
      addRandomTodo: () => {
        const randomTodoData = generateRandomTodo()
        const newTodo: Todo = {
          ...randomTodoData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ todos: [...state.todos, newTodo] }))
      },
      
      // UI状态
      setSortBy: (sortBy) => set({ sortBy }),
      setSelectedTodo: (todo) => set({ selectedTodo: todo }),
      setIsEditing: (editing) => set({ isEditing: editing }),
      
      // 计算属性
      getFilteredTodos: () => {
        const { todos, sortBy } = get()
        
        return [...todos].sort((a, b) => {
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
              const statusOrder = { waiting: 0, progress: 1, done: 2 }
              return statusOrder[a.status] - statusOrder[b.status]
            }
            default:
              return b.createdAt.getTime() - a.createdAt.getTime()
          }
        })
      },
      
      getTodosCount: () => {
        const { todos } = get()
        return {
          waiting: todos.filter(todo => todo.status === 'waiting').length,
          progress: todos.filter(todo => todo.status === 'progress').length,
          done: todos.filter(todo => todo.status === 'done').length,
          total: todos.length
        }
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