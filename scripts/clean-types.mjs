import { rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// 类型声明每次全量重生成，避免删除或重命名组件后残留旧 .d.ts
rmSync(fileURLToPath(new URL('../ui/types', import.meta.url)), { recursive: true, force: true })
