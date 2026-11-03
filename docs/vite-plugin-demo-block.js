import { parse } from 'vue/compiler-sfc'
import { CollectRelatedDeclarations, ExtractImports } from './sfc-code.js'

const ELEMENT = 1
const TEXT = 2
const COMMENT = 3
const ATTRIBUTE = 6
const DIRECTIVE = 7

// 这些类只服务于文档排版，展示代码时应连同外层元素一起去掉
const LAYOUT_CLASSES = new Set(['doc_row', 'doc_grid', 'doc_stack'])

function isElement(node) {
    return node.type === ELEMENT
}

function isMeaningful(node) {
    if (node.type === COMMENT) return false
    if (node.type === TEXT) return node.content.trim() !== ''
    return true
}

function findTagEnd(source, start) {
    let quote = ''

    for (let index = start; index < source.length; index++) {
        const char = source[index]

        if (quote) {
            if (char === quote && source[index - 1] !== '\\') quote = ''
            continue
        }

        if (char === '"' || char === "'") {
            quote = char
            continue
        }

        if (char === '>') return index
    }

    return -1
}

function walk(node, visit) {
    visit(node)
    if (node.children) {
        for (const child of node.children) walk(child, visit)
    }
}

function hasProp(node, name) {
    return node.props.some((prop) => {
        if (prop.type === ATTRIBUTE) return prop.name === name
        if (prop.type === DIRECTIVE) return prop.name === 'bind' && prop.arg?.content === name
        return false
    })
}

function hasCodeProp(node) {
    return hasProp(node, 'code')
}

function classAttribute(node) {
    return node.props.find(prop => prop.type === ATTRIBUTE && prop.name === 'class')
}

// 找出需要从展示代码里移除的文档排版包装层与排版类。
function collectCuts(slot, source) {
    const cuts = []

    function processElement(element) {
        const attribute = classAttribute(element)
        if (!attribute) return

        const classes = attribute.value.content.split(/\s+/).filter(Boolean)
        const layout = classes.filter(name => LAYOUT_CLASSES.has(name))
        if (!layout.length && !classes.includes('doc_gap')) return

        const others = element.props.filter(prop => prop !== attribute)
        const remaining = classes.filter(name => !LAYOUT_CLASSES.has(name) && name !== 'doc_gap')

        // 带 v-if、事件等属性的排版层不能整个删掉，只清理排版类
        if (!layout.length || others.length) {
            if (remaining.length) {
                cuts.push({
                    start: attribute.loc.start.offset,
                    end: attribute.loc.end.offset,
                    text: `class="${remaining.join(' ')}"`,
                })
            } else {
                const start = source[attribute.loc.start.offset - 1] === ' '
                    ? attribute.loc.start.offset - 1
                    : attribute.loc.start.offset
                cuts.push({ start, end: attribute.loc.end.offset, text: '' })
            }
            return
        }

        const children = element.children.filter(isMeaningful)
        if (!children.length) {
            cuts.push({ start: element.loc.start.offset, end: element.loc.end.offset, text: '' })
            return
        }

        // 删掉开始标签；若标签独占一行，把整行一起删掉，保留内容自身的缩进
        const tagEnd = findTagEnd(source, element.loc.start.offset) + 1
        const firstChild = children[0]
        const gap = source.slice(tagEnd, firstChild.loc.start.offset)
        const lineStart = source.lastIndexOf('\n', element.loc.start.offset - 1) + 1
        const linePrefix = source.slice(lineStart, element.loc.start.offset)

        if (gap.includes('\n') && /^[ \t]*$/.test(linePrefix)) {
            const childLineStart = tagEnd + gap.lastIndexOf('\n') + 1
            cuts.push({ start: lineStart, end: childLineStart, text: '' })
        } else {
            cuts.push({ start: element.loc.start.offset, end: firstChild.loc.start.offset, text: '' })
        }

        // 删掉结束标签以及紧贴它的缩进与换行
        cuts.push({
            start: children[children.length - 1].loc.end.offset,
            end: element.loc.end.offset,
            text: '',
        })
    }

    function visit(node) {
        if (!node.children) return
        for (const child of node.children) {
            if (!isElement(child)) continue
            processElement(child)
            visit(child)
        }
    }

    visit(slot)
    return cuts
}

function applyCuts(source, base, cuts) {
    const sorted = [...cuts].sort((a, b) => a.start - b.start)
    const limit = base + source.length
    let result = ''
    let cursor = base

    for (const cut of sorted) {
        if (cut.start < cursor || cut.end > limit) continue
        result += source.slice(cursor - base, cut.start - base)
        result += cut.text || ''
        cursor = cut.end
    }

    return result + source.slice(cursor - base)
}

// 保留源码里的换行与内部缩进，只去掉插槽整体的公共缩进和首尾空行。
function normalizeSlot(source) {
    const inlineFirst = source.length > 0 && !/^\s*\n/.test(source)
    const lines = source.replace(/\r\n?/g, '\n').split('\n')

    while (lines.length && lines[0].trim() === '') lines.shift()
    while (lines.length && lines[lines.length - 1].trim() === '') lines.pop()

    if (!lines.length) return ''

    // 公共缩进以第一行之后的内容为准；移除包装层后首行可能比内容浅。
    let body = lines.slice(1)
    if (!body.some(line => line.trim())) body = lines

    let indent = ''
    for (const line of body) {
        if (!line.trim()) continue
        const lead = line.match(/^[ \t]*/)[0]
        if (!indent || lead.length < indent.length) indent = lead
    }

    return lines
        .map((line, index) => {
            if (inlineFirst && index === 0) return line
            return line.startsWith(indent) ? line.slice(indent.length) : line.replace(/^[ \t]*/, '')
        })
        .join('\n')
}

function escapeAttribute(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}

function indentBlock(value) {
    return String(value || '')
        .split('\n')
        .map(line => (line.trim() ? `  ${line}` : ''))
        .join('\n')
}

function buildPlaygroundCode(script, template, style) {
    let declarations = []

    try {
        declarations = CollectRelatedDeclarations(script, template)
    } catch {
        declarations = []
    }

    const imports = ExtractImports(script).map(item => item.code)
    const body = [...imports, ...declarations.map(item => item.code)]
    const sections = []

    if (body.length) {
        sections.push(`<script setup>\n${body.join('\n\n')}\n</script>`)
    }

    if (template) {
        sections.push(`<template>\n${indentBlock(template)}\n</template>`)
    }

    if (style) {
        sections.push(`<style>\n${style.trim()}\n</style>`)
    }

    return sections.join('\n\n')
}

function injectCode(source, file) {
    if (!source.includes('<DemoBlock')) return null

    const { descriptor, errors } = parse(source, { filename: file })
    if (errors.length || !descriptor.template?.ast) return null

    const script = descriptor.scriptSetup?.content || ''
    const style = descriptor.styles.map(item => item.content).join('\n\n')
    const jobs = []

    walk(descriptor.template.ast, (node) => {
        if (!isElement(node) || node.tag !== 'DemoBlock') return

        const openEnd = findTagEnd(source, node.loc.start.offset)
        if (openEnd === -1) return

        const openTag = source.slice(node.loc.start.offset, openEnd + 1)
        if (/\/\s*>$/.test(openTag)) return

        const closeStart = source.lastIndexOf('</DemoBlock', node.loc.end.offset)
        if (closeStart === -1) return

        const base = openEnd + 1
        const rawSlot = source.slice(base, closeStart)
        const displaySlot = applyCuts(rawSlot, base, collectCuts(node, source))
        const template = normalizeSlot(displaySlot)
        const playgroundTemplate = normalizeSlot(rawSlot)
        const playgroundCode = buildPlaygroundCode(script, playgroundTemplate, style)

        jobs.push({
            at: openEnd,
            code: template,
            playgroundCode,
            hasCode: hasCodeProp(node),
            injectPlayground: !hasProp(node, 'playground-code'),
        })
    })

    if (!jobs.length) return null

    jobs.sort((a, b) => b.at - a.at)

    let output = source
    for (const job of jobs) {
        let attribute = ''

        if (!job.hasCode) {
            attribute += ` :code="${escapeAttribute(JSON.stringify(job.code))}"`
        }

        if (job.injectPlayground) {
            attribute += ` :playground-code="${escapeAttribute(JSON.stringify(job.playgroundCode))}"`
        }

        if (!attribute) continue

        output = output.slice(0, job.at) + attribute + output.slice(job.at)
    }

    return output
}

export default function demoBlockAutoCode() {
    return {
        name: 'demo-block-auto-code',
        enforce: 'pre',
        transform(source, id) {
            const file = id.split('?')[0].replace(/\\/g, '/')
            if (!file.endsWith('.vue') || !file.includes('/docs/')) return null

            const code = injectCode(source, file)
            return code ? { code, map: null } : null
        },
    }
}
