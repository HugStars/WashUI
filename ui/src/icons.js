export const defaultIcons = {
    home: [
        ['path', { d: 'm3 10.5 9-7.5 9 7.5' }],
        ['path', { d: 'M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5' }],
    ],
    list: [
        ['line', { x1: 8, y1: 6, x2: 21, y2: 6 }],
        ['line', { x1: 8, y1: 12, x2: 21, y2: 12 }],
        ['line', { x1: 8, y1: 18, x2: 21, y2: 18 }],
        ['circle', { cx: 3.5, cy: 6, r: 1, fill: 'currentColor', stroke: 'none' }],
        ['circle', { cx: 3.5, cy: 12, r: 1, fill: 'currentColor', stroke: 'none' }],
        ['circle', { cx: 3.5, cy: 18, r: 1, fill: 'currentColor', stroke: 'none' }],
    ],
    speed: [
        ['path', { d: 'M12 14l4-4' }],
        ['path', { d: 'M4.93 19.07a10 10 0 1 1 14.14 0' }],
    ],
    close: [
        ['line', { x1: 18, y1: 6, x2: 6, y2: 18 }],
        ['line', { x1: 6, y1: 6, x2: 18, y2: 18 }],
    ],
    copy: [
        ['rect', { x: 9, y: 9, width: 13, height: 13, rx: 2 }],
        ['path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' }],
    ],
    refresh: [
        ['path', { d: 'M21 12a9 9 0 1 1-2.64-6.36' }],
        ['path', { d: 'M21 3v6h-6' }],
    ],
    chevron: [
        ['polyline', { points: '9 18 15 12 9 6' }],
    ],
    edit: [
        ['path', { d: 'M12 20h9' }],
        ['path', { d: 'M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z' }],
    ],
    upload: [
        ['path', { d: 'M12 16V4' }],
        ['path', { d: 'm7 9 5-5 5 5' }],
        ['path', { d: 'M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3' }],
    ],
    file: [
        ['path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }],
        ['polyline', { points: '14 2 14 8 20 8' }],
    ],
    link: [
        ['path', { d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' }],
        ['path', { d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' }],
    ],
    layout: [
        ['rect', { x: 3, y: 4, width: 18, height: 16, rx: 2 }],
        ['line', { x1: 3, y1: 9, x2: 21, y2: 9 }],
        ['line', { x1: 9, y1: 9, x2: 9, y2: 20 }],
    ],
    grid: [
        ['rect', { x: 3, y: 3, width: 7, height: 7, rx: 1 }],
        ['rect', { x: 14, y: 3, width: 7, height: 7, rx: 1 }],
        ['rect', { x: 3, y: 14, width: 7, height: 7, rx: 1 }],
        ['rect', { x: 14, y: 14, width: 7, height: 7, rx: 1 }],
    ],
    sun: [
        ['circle', { cx: 12, cy: 12, r: 4 }],
        ['path', { d: 'M12 2v2' }],
        ['path', { d: 'M12 20v2' }],
        ['path', { d: 'm4.93 4.93 1.41 1.41' }],
        ['path', { d: 'm17.66 17.66 1.41 1.41' }],
        ['path', { d: 'M2 12h2' }],
        ['path', { d: 'M20 12h2' }],
        ['path', { d: 'm6.34 17.66-1.41 1.41' }],
        ['path', { d: 'm19.07 4.93-1.41 1.41' }],
    ],
    moon: [
        ['path', { d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' }],
    ],
    more: [
        ['circle', { cx: 5, cy: 12, r: 1.5, fill: 'currentColor', stroke: 'none' }],
        ['circle', { cx: 12, cy: 12, r: 1.5, fill: 'currentColor', stroke: 'none' }],
        ['circle', { cx: 19, cy: 12, r: 1.5, fill: 'currentColor', stroke: 'none' }],
    ],
}

const registry = { ...defaultIcons }

export function configureIcons(icons = {}) {
    for (const [name, value] of Object.entries(icons)) {
        if (value === null || value === undefined) delete registry[name]
        else registry[name] = value
    }
}

export function getIcon(name) {
    return registry[name]
}

export function iconNames() {
    return Object.keys(registry)
}
