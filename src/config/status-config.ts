export const statusConfig = {
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
    titleClass: 'text-green-900 dark:text-gray-100',
    subtitleClass: 'text-green-600 dark:text-green-400'
  }
} as const

export type TodoStatus = keyof typeof statusConfig
