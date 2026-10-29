export const codeLanguages = [
    { value: 'plain', label: 'Plain text' },
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'md', label: 'Markdown' },
    { value: 'py', label: 'Python' },
    { value: 'bash', label: 'Bash' },
    { value: 'sql', label: 'SQL' },
    { value: 'go', label: 'Go' },
    { value: 'java', label: 'Java' },
    { value: 'c', label: 'C' },
    { value: 'rs', label: 'Rust' },
    { value: 'yaml', label: 'YAML' },
    { value: 'xml', label: 'XML' },
    { value: 'asm', label: 'Assembly' },
    { value: 'bf', label: 'Brainfuck' },
    { value: 'csv', label: 'CSV' },
    { value: 'diff', label: 'Diff' },
    { value: 'docker', label: 'Dockerfile' },
    { value: 'git', label: 'Git' },
    { value: 'http', label: 'HTTP' },
    { value: 'ini', label: 'INI' },
    { value: 'jsdoc', label: 'JSDoc' },
    { value: 'leanpub-md', label: 'LeanPub Markdown' },
    { value: 'log', label: 'Log' },
    { value: 'lua', label: 'Lua' },
    { value: 'make', label: 'Makefile' },
    { value: 'pl', label: 'Perl' },
    { value: 'regex', label: 'Regex' },
    { value: 'todo', label: 'TODO' },
    { value: 'toml', label: 'TOML' },
    { value: 'uri', label: 'URI' },
]

const aliases = {
    javascript: 'js',
    mjs: 'js',
    cjs: 'js',
    typescript: 'ts',
    python: 'py',
    rust: 'rs',
    markdown: 'md',
    shell: 'bash',
    sh: 'bash',
    zsh: 'bash',
    yml: 'yaml',
    htm: 'html',
    dockerfile: 'docker',
    makefile: 'make',
    text: 'plain',
    txt: 'plain',
}

export const codeLanguageNames = codeLanguages.map(item => item.value)

export function normalizeCodeLang(lang) {
    const name = String(lang || 'plain').trim().toLowerCase()
    return aliases[name] || name || 'plain'
}

export function codeLanguageLabel(lang) {
    const name = normalizeCodeLang(lang)
    return codeLanguages.find(item => item.value === name)?.label || name
}
