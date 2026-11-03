const IDENTIFIER = /[A-Za-z_$][\w$]*/g

const RESERVED = new Set([
    'async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue',
    'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'false',
    'finally', 'for', 'from', 'function', 'if', 'import', 'in', 'instanceof',
    'let', 'new', 'null', 'of', 'return', 'super', 'switch', 'this', 'throw',
    'true', 'try', 'typeof', 'undefined', 'var', 'void', 'while', 'with', 'yield',
])

function IsWordChar(char) {
    return Boolean(char) && /[\w$]/.test(char)
}

function SkipQuoted(source, start) {
    const quote = source[start]
    let index = start + 1

    while (index < source.length) {
        const char = source[index]
        if (char === '\\') {
            index += 2
            continue
        }
        if (char === quote) return index + 1
        index++
    }

    return source.length
}

function SkipComment(source, start) {
    if (source[start + 1] === '/') {
        const end = source.indexOf('\n', start + 2)
        return end === -1 ? source.length : end
    }

    if (source[start + 1] === '*') {
        const end = source.indexOf('*/', start + 2)
        return end === -1 ? source.length : end + 2
    }

    return -1
}

function SplitTopLevel(source, separator) {
    const parts = []
    let start = 0
    let depth = 0
    let index = 0

    while (index < source.length) {
        const char = source[index]

        if (char === '/' && SkipComment(source, index) !== -1) {
            index = SkipComment(source, index)
            continue
        }

        if (char === '"' || char === "'" || char === '`') {
            index = SkipQuoted(source, index)
            continue
        }

        if (char === '{' || char === '[' || char === '(') {
            depth++
            index++
            continue
        }

        if (char === '}' || char === ']' || char === ')') {
            depth = Math.max(0, depth - 1)
            index++
            continue
        }

        if (char === separator && depth === 0) {
            parts.push(source.slice(start, index))
            start = index + 1
        }

        index++
    }

    parts.push(source.slice(start))
    return parts
}

function FindTopLevelChar(source, target) {
    let depth = 0
    let index = 0

    while (index < source.length) {
        const char = source[index]

        if (char === '/' && SkipComment(source, index) !== -1) {
            index = SkipComment(source, index)
            continue
        }

        if (char === '"' || char === "'" || char === '`') {
            index = SkipQuoted(source, index)
            continue
        }

        if (char === '{' || char === '[' || char === '(') {
            depth++
            index++
            continue
        }

        if (char === '}' || char === ']' || char === ')') {
            depth = Math.max(0, depth - 1)
            index++
            continue
        }

        if (char === target && depth === 0) return index
        index++
    }

    return -1
}

function FindStatementEnd(source, start) {
    let depth = 0
    let index = start

    while (index < source.length) {
        const char = source[index]

        if (char === '/' && SkipComment(source, index) !== -1) {
            index = SkipComment(source, index)
            continue
        }

        if (char === '"' || char === "'" || char === '`') {
            index = SkipQuoted(source, index)
            continue
        }

        if (char === '{' || char === '[' || char === '(') {
            depth++
            index++
            continue
        }

        if (char === '}' || char === ']' || char === ')') {
            depth = Math.max(0, depth - 1)
            index++
            continue
        }

        if (char === ';' && depth === 0) return index + 1

        if (char === '\n' && depth === 0) {
            const before = source.slice(start, index).trimEnd()
            const after = source.slice(index + 1).trimStart()
            const continues = /[=,+\-*/%&|^!?:<>.]$/.test(before) || /^[.(\[]/.test(after)

            if (!continues) return index
        }

        index++
    }

    return source.length
}

function ExtractPatternNames(pattern) {
    const value = pattern.trim()
    if (/^[A-Za-z_$][\w$]*$/.test(value)) return [value]
    if (!/^[{[]/.test(value)) return []

    const names = new Set()

    for (const match of value.matchAll(IDENTIFIER)) {
        const name = match[0]
        if (RESERVED.has(name)) continue

        const after = value.slice(match.index + name.length)
        if (/^\s*:/.test(after)) continue

        names.add(name)
    }

    return [...names]
}

function ParseVariableStatement(keyword, statement, start) {
    const body = statement.replace(/;\s*$/, '')
    const declarations = []

    for (const segment of SplitTopLevel(body, ',')) {
        const equals = FindTopLevelChar(segment, '=')
        if (equals === -1) continue

        const pattern = segment.slice(0, equals).trim()
        const value = segment.slice(equals + 1).trim()
        if (!pattern || !value) continue

        const names = ExtractPatternNames(pattern)
        if (!names.length) continue

        declarations.push({
            names,
            code: `${keyword} ${pattern} = ${value}`,
            start,
        })
    }

    return declarations
}

export function ExtractIdentifiers(code) {
    const names = new Set()

    for (const match of String(code || '').matchAll(IDENTIFIER)) {
        if (!RESERVED.has(match[0])) names.add(match[0])
    }

    return names
}

export function ExtractImports(script) {
    const source = String(script || '')
    const imports = []
    let index = 0
    let depth = 0

    while (index < source.length) {
        const char = source[index]

        if (char === '/' && SkipComment(source, index) !== -1) {
            index = SkipComment(source, index)
            continue
        }

        if (char === '"' || char === "'" || char === '`') {
            index = SkipQuoted(source, index)
            continue
        }

        if (char === '{' || char === '[' || char === '(') {
            depth++
            index++
            continue
        }

        if (char === '}' || char === ']' || char === ')') {
            depth = Math.max(0, depth - 1)
            index++
            continue
        }

        if (
            depth === 0
            && (index === 0 || !IsWordChar(source[index - 1]))
            && source.startsWith('import', index)
            && !IsWordChar(source[index + 6])
            && source[index + 6] !== '('
            && source[index + 6] !== '.'
        ) {
            const end = FindStatementEnd(source, index)
            imports.push({
                code: source.slice(index, end).trim(),
                start: index,
                end,
            })
            index = end
            continue
        }

        index++
    }

    return imports
}

export function ExtractImportNames(script) {
    const names = new Set()

    for (const { code } of ExtractImports(script)) {
        let clause = code.replace(/^import\s+/, '').trim()
        const from = clause.match(/^([\s\S]*?)\s+from\s+['"][^'"]+['"]/)
        if (from) clause = from[1].trim()
        else if (/^['"]/.test(clause)) continue

        if (!clause) continue

        if (/^\*\s+as\s+/.test(clause)) {
            const match = /^\*\s+as\s+([A-Za-z_$][\w$]*)$/.exec(clause)
            if (match) names.add(match[1])
            continue
        }

        for (const part of SplitTopLevel(clause, ',')) {
            const value = part.trim()
            if (!value) continue

            if (value.startsWith('{')) {
                const inner = value.replace(/^\{/, '').replace(/\}$/, '')
                for (const item of inner.split(',')) {
                    const match = /^(?:type\s+)?([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/.exec(item.trim())
                    if (!match) continue
                    names.add(match[2] || match[1])
                }
                continue
            }

            if (/^[A-Za-z_$][\w$]*$/.test(value)) names.add(value)
        }
    }

    return names
}

export function StripImports(script) {
    const source = String(script || '')
    const imports = ExtractImports(source)
    let result = ''
    let cursor = 0

    for (const item of imports) {
        result += source.slice(cursor, item.start)
        cursor = item.end
    }

    return result + source.slice(cursor)
}

export function ExtractDeclarations(script) {
    const source = String(script || '')
    const declarations = []
    let index = 0
    let depth = 0

    while (index < source.length) {
        const char = source[index]

        if (char === '/' && SkipComment(source, index) !== -1) {
            index = SkipComment(source, index)
            continue
        }

        if (char === '"' || char === "'" || char === '`') {
            index = SkipQuoted(source, index)
            continue
        }

        if (char === '{' || char === '[' || char === '(') {
            depth++
            index++
            continue
        }

        if (char === '}' || char === ']' || char === ')') {
            depth = Math.max(0, depth - 1)
            index++
            continue
        }

        if (depth === 0 && (index === 0 || !IsWordChar(source[index - 1]))) {
            const rest = source.slice(index)
            const variable = /^(const|let|var)\b/.exec(rest)

            if (variable) {
                const end = FindStatementEnd(source, index + variable[0].length)
                declarations.push(...ParseVariableStatement(
                    variable[1],
                    source.slice(index + variable[0].length, end),
                    index,
                ))
                index = end
                continue
            }

            const fn = /^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/.exec(rest)
            if (fn) {
                const end = FindStatementEnd(source, index)
                declarations.push({
                    names: [fn[1]],
                    code: source.slice(index, end).trim(),
                    start: index,
                })
                index = end
                continue
            }

            const cls = /^class\s+([A-Za-z_$][\w$]*)/.exec(rest)
            if (cls) {
                const end = FindStatementEnd(source, index)
                declarations.push({
                    names: [cls[1]],
                    code: source.slice(index, end).trim(),
                    start: index,
                })
                index = end
                continue
            }
        }

        index++
    }

    return declarations
}

export function ExtractDeclaredNames(script) {
    const names = new Set()

    for (const declaration of ExtractDeclarations(script)) {
        for (const name of declaration.names) names.add(name)
    }

    return names
}

export function CollectRelatedDeclarations(script, template) {
    const declarations = ExtractDeclarations(script)
    const byName = new Map()

    for (const declaration of declarations) {
        for (const name of declaration.names) byName.set(name, declaration)
    }

    const used = ExtractIdentifiers(template)
    const selected = new Set()
    let changed = true

    while (changed) {
        changed = false

        for (const [name, declaration] of byName) {
            if (!used.has(name) || selected.has(declaration)) continue

            selected.add(declaration)
            for (const identifier of ExtractIdentifiers(declaration.code)) used.add(identifier)
            changed = true
        }
    }

    return [...selected].sort((a, b) => a.start - b.start)
}
