<template>
    <DocPage category="基础" name="AppCode" title="代码" description="基于 Speed-highlight 的代码块，内置 34 种语言，支持行号、复制与自定义最大高度。">
        <DemoBlock title="基础" description="code 传入代码字符串，lang 指定高亮语言；头部展示语言名称与复制按钮。" :code="baseCode">
            <AppCode :code="jsCode" lang="js" />
        </DemoBlock>

        <DemoBlock title="切换语言" description="lang 使用 Speed-highlight 的语言名，也接受 javascript、python、shell 等常见别名。" :code="switchCode">
            <div class="doc_stack">
                <AppSelect v-model="lang" label="语言" :options="languageOptions" />
                <AppCode :code="sample" :lang="lang" show-line-numbers :max-height="320" />
            </div>
        </DemoBlock>

        <DemoBlock title="无头部" description="关闭 show-lang 与 copyable 后只保留代码区域，适合嵌入卡片或面板。" :code="plainCode">
            <AppCode :code="cssCode" lang="css" :show-lang="false" :copyable="false" :max-height="180" />
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="语言" kind="values" :rows="languageRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { computed, ref } from 'vue'
import { codeLanguages } from '@wash/ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const lang = ref('js')
const languageOptions = codeLanguages.map(item => ({ label: item.label, value: item.value }))

const jsCode = `// 等待所有任务完成
const results = await Promise.all(tasks.map(task => task.run()))

const online = results.filter(item => item.ok)
console.log(\`\${online.length} / \${results.length} 个任务成功\`)`

const cssCode = `:root {
    --wa_color_accent: #05cfa4;
    --wa_radius_card: 20px;
}

.wa_card {
    padding: 26px;
    border-radius: var(--wa_radius_card);
    background: var(--wa_color_surface);
}`

const samples = {
    js: jsCode,
    ts: `type Task = {
    id: string
    run: () => Promise<boolean>
}

export async function runAll(tasks: Task[]) {
    const results = await Promise.all(tasks.map(task => task.run()))
    return results.filter(Boolean).length
}`,
    py: `from dataclasses import dataclass


@dataclass
class Task:
    name: str
    done: bool = False


def summary(tasks: list[Task]) -> str:
    finished = sum(task.done for task in tasks)
    return f"{finished} / {len(tasks)} 已完成"`,
    html: `<article class="card">
    <h2>运行状态</h2>
    <p>所有节点在线。</p>
    <button type="button">查看详情</button>
</article>`,
    css: cssCode,
    json: `{
    "name": "wash-ui",
    "version": "0.1.0",
    "private": true,
    "keywords": ["vue", "design-system"]
}`,
    bash: `pnpm install
pnpm dev

git add .
git commit -m "feat: add AppCode"`,
    sql: `SELECT service, COUNT(*) AS total
FROM requests
WHERE created_at >= NOW() - INTERVAL '1 day'
GROUP BY service
ORDER BY total DESC;`,
    go: `package main

import "fmt"

func main() {
    items := []string{"a", "b", "c"}
    for i, item := range items {
        fmt.Println(i, item)
    }
}`,
    rs: `fn main() {
    let items = vec!["a", "b", "c"];

    for (index, item) in items.iter().enumerate() {
        println!("{index}: {item}");
    }
}`,
    md: `# AppCode

- 支持 **34** 种语言
- 行号与复制
- 自动跟随主题

> 基于 Speed-highlight。`,
}

const sample = computed(() => samples[lang.value] || `<!-- ${lang.value} 示例 -->\n<code>Hello WashUI</code>`)

const propsRows = [
    { name: 'code', type: 'string', default: "''", desc: '需要高亮的代码' },
    { name: 'lang', type: 'string', default: "'plain'", desc: '语言名或常见别名' },
    { name: 'showLineNumbers', type: 'boolean', default: 'false', desc: '显示行号' },
    { name: 'showLang', type: 'boolean', default: 'true', desc: '头部显示语言名称' },
    { name: 'copyable', type: 'boolean', default: 'true', desc: '头部显示复制按钮' },
    { name: 'maxHeight', type: 'number | string', default: '0', desc: '代码区最大高度，0 表示不限制' },
]

const languageRows = codeLanguages.map(item => ({ name: item.value, desc: item.label }))

const baseCode = `<AppCode :code="code" lang="js" />`

const switchCode = `<AppCode :code="code" :lang="lang" show-line-numbers :max-height="320" />`

const plainCode = `<AppCode :code="code" lang="css" :show-lang="false" :copyable="false" :max-height="180" />`
</script>
