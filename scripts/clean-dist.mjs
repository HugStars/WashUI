import { rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

// ! 构建前清空文档站产物；这是旧 hash 文件持续累积的兜底，不要删除
const dist = fileURLToPath(new URL('../dist', import.meta.url))
await rm(dist, { recursive: true, force: true })
