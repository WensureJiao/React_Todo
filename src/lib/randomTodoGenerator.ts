import { type Todo } from '../store/todoStore'

// 随机数据配置
const RANDOM_DATA = {
  titles: [
    '完成项目文档',
    '学习新技术',
    '整理桌面文件',
    '回复邮件',
    '准备会议材料',
    '更新简历',
    '整理代码仓库',
    '阅读技术文章',
    '优化网站性能',
    '修复bug',
    '写单元测试',
    '代码审查',
    '设计新功能',
    '用户调研',
    '数据分析',
    '制定计划',
    '团队沟通',
    '产品规划',
    '市场调研',
    '竞品分析'
  ],
  
  subtitles: [
    '优先级：高',
    '紧急任务',
    '本周完成',
    '重要项目',
    '个人提升',
    '工作相关',
    '学习目标',
    '生活安排',
    '健康管理',
    '财务规划'
  ],
  
  descriptions: [
    '这是一个重要的任务，需要仔细处理',
    '请确保在截止日期前完成',
    '需要与团队成员协调',
    '建议分步骤进行',
    '完成后记得总结经验',
    '如有问题及时沟通',
    '可以参考之前的案例',
    '需要收集相关资料',
    '建议先做调研',
    '完成后需要验收'
  ],
  
  statuses: ['waiting', 'progress', 'done'] as const
}

/**
 * 从数组中随机选择一个元素
 */
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * 生成随机时间
 * @param daysRange 天数范围，如 [-15, 15] 表示过去15天到未来15天
 * @param hourRange 小时范围，如 [8, 20] 表示8点到20点
 */
function generateRandomTime(daysRange: [number, number], hourRange: [number, number]): Date {
  const now = new Date()
  const [minDays, maxDays] = daysRange
  const [minHour, maxHour] = hourRange
  
  const randomDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays
  const randomDate = new Date(now.getTime() + randomDays * 24 * 60 * 60 * 1000)
  
  const randomHour = Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour
  const randomMinute = Math.floor(Math.random() * 4) * 15 // 0, 15, 30, 45
  
  randomDate.setHours(randomHour, randomMinute, 0, 0)
  return randomDate
}

/**
 * 生成一个随机的待办事项
 */
export function generateRandomTodo(): Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> {
  // 生成基础数据
  const title = getRandomItem(RANDOM_DATA.titles)
  const subtitle = Math.random() > 0.5 ? getRandomItem(RANDOM_DATA.subtitles) : undefined
  const description = Math.random() > 0.6 ? getRandomItem(RANDOM_DATA.descriptions) : undefined
  const status = getRandomItem([...RANDOM_DATA.statuses]) as typeof RANDOM_DATA.statuses[number]
  
  // 生成时间（30%概率有开始时间，20%概率有结束时间）
  let startTime: Date | undefined
  let endTime: Date | undefined
  
  if (Math.random() < 0.3) {
    startTime = generateRandomTime([-15, 15], [8, 19])
  }
  
  if (Math.random() < 0.2) {
    endTime = generateRandomTime([1, 30], [14, 22])
  }
  
  // 确保结束时间晚于开始时间
  if (startTime && endTime && endTime <= startTime) {
    endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000) // 加一天
  }
  
  return {
    title,
    subtitle,
    description,
    startTime,
    endTime,
    status
  }
}

/**
 * 批量生成随机待办事项
 * @param count 生成数量
 */
export function generateRandomTodos(count: number): Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>[] {
  return Array.from({ length: count }, () => generateRandomTodo())
}
