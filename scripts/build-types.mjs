import { parse as parseSfc } from '@vue/compiler-sfc'
import { parse as parseJs } from 'acorn'
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const srcRoot = join(root, 'ui/src')
const outRoot = join(root, 'ui/types')

const RUNTIME_TYPES = {
    String: 'string',
    Number: 'number',
    Boolean: 'boolean',
    Symbol: 'symbol',
    BigInt: 'bigint',
    Object: 'Record<string, any>',
    Array: 'any[]',
    Function: '((...args: any[]) => any)',
}

function runtimeType(node) {
    if (!node) return 'any'
    if (node.type === 'Identifier') return RUNTIME_TYPES[node.name] || 'any'
    if (node.type === 'ArrayExpression') {
        const list = node.elements.map(runtimeType).filter(Boolean)
        return [...new Set(list)].join(' | ') || 'any'
    }
    return 'any'
}

function propOptions(node) {
    if (node?.type !== 'ObjectExpression') {
        return { type: runtimeType(node), required: false }
    }

    const fields = new Map()
    for (const property of node.properties) {
        if (property.type !== 'Property') continue
        const key = property.key.name ?? property.key.value
        fields.set(key, property.value)
    }

    const required = fields.get('required')?.value === true
    return {
        type: runtimeType(fields.get('type')),
        required,
    }
}

function findJsDoc(comments, start, source) {
    let found = null
    for (const comment of comments) {
        if (comment.type !== 'Block' || comment.end > start) continue
        if (!comment.value.startsWith('*')) continue
        // 只认紧邻属性的 JSDoc，避免把上一个属性的注释带到下一个
        if (source.slice(comment.end, start).trim() !== '') continue
        found = comment
    }
    return found
}

function docType(comment) {
    if (!comment) return ''
    const match = comment.value.match(/@type\s+\{([\s\S]*?)\}/)
    return match ? match[1].trim() : ''
}

function findProps(ast, comments, source) {
    let node = null
    let emits = []

    function walk(current) {
        if (!current || typeof current !== 'object') return
        if (current.type === 'CallExpression' && current.callee?.name === 'defineProps') {
            const first = current.arguments?.[0]
            if (first?.type === 'ObjectExpression') node = first
        }
        if (current.type === 'CallExpression' && current.callee?.name === 'defineEmits') {
            const first = current.arguments?.[0]
            if (first?.type === 'ArrayExpression') {
                emits = first.elements
                    .filter(item => item?.type === 'Literal' && typeof item.value === 'string')
                    .map(item => item.value)
            }
        }
        for (const value of Object.values(current)) {
            if (Array.isArray(value)) value.forEach(walk)
            else walk(value)
        }
    }

    walk(ast)
    if (!node) return null

    const props = []
    for (const property of node.properties) {
        if (property.type !== 'Property') continue
        const name = property.key.name ?? property.key.value
        if (!name) continue

        const options = propOptions(property.value)
        const comment = findJsDoc(comments, property.start, source)
        const explicit = docType(comment)

        props.push({
            name,
            type: explicit || options.type,
            optional: !options.required,
        })
    }

    return { props, emits }
}

function buildComponent(file) {
    const source = readFileSync(file, 'utf8')
    const { descriptor } = parseSfc(source, { filename: file })
    const code = descriptor.scriptSetup?.content
    if (!code) return null

    const comments = []
    const ast = parseJs(code, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        onComment: comments,
    })

    const result = findProps(ast, comments, code)
    if (!result) return null

    const name = file.split(/[\\/]/).pop().replace(/\.vue$/, '')
    const props = result.props.map(prop => `    ${prop.name}${prop.optional ? '?' : ''}: ${prop.type}`).join('\n')
    const emits = result.emits.length
        ? `{\n${result.emits.map(event => `    '${event}': (...args: any[]) => any`).join('\n')}\n}`
        : '{}'

    return {
        name,
        type: [
            `import type { DefineComponent } from 'vue'`,
            '',
            `declare const ${name}: DefineComponent<{`,
            props,
            `}, {}, {}, {}, {}, {}, {}, ${emits}>`,
            '',
            `export default ${name}`,
            '',
        ].join('\n'),
    }
}

function writeComponents(dir, outputDir) {
    const files = readdirSync(dir).filter(file => file.endsWith('.vue'))
    const generated = []

    for (const file of files) {
        const component = buildComponent(join(dir, file))
        if (!component) {
            const name = file.replace(/\.vue$/, '')
            generated.push({
                name,
                type: `export { default } from './${name}.vue'\n`,
            })
            continue
        }
        generated.push(component)
    }

    mkdirSync(outputDir, { recursive: true })
    for (const component of generated) {
        writeFileSync(join(outputDir, `${component.name}.d.ts`), component.type, 'utf8')
    }

    const index = generated
        .map(component => `export { default as ${component.name} } from './${component.name}'`)
        .join('\n')
    writeFileSync(join(outputDir, 'index.d.ts'), index + '\n', 'utf8')
}

function writeEntry() {
    const source = readFileSync(join(srcRoot, 'index.js'), 'utf8')
    const output = source
        .replace(/^import\s+['"]\.\/styles\/index\.css['"]\s*\n/m, '')
        .replace(/\.js'/g, "'")
        .replace(/from '@speed-highlight\/core'/, "from '@speed-highlight/core'")

    writeFileSync(join(outRoot, 'index.d.ts'), output, 'utf8')
}

mkdirSync(outRoot, { recursive: true })
writeComponents(join(srcRoot, 'components'), join(outRoot, 'components'))
writeComponents(join(srcRoot, 'layout'), join(outRoot, 'layout'))
writeEntry()

console.log(`types written to ${relative(root, outRoot)}`)
