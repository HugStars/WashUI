import { describe, expect, it } from 'vitest'
import { sanitizeSvg } from '@ui/src/utils/svg.js'

describe('sanitizeSvg', () => {
    it('removes scripts and event attributes', () => {
        const html = sanitizeSvg('<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" onload="alert(1)"/></svg>')
        expect(html).toContain('<path')
        expect(html).not.toContain('onload')
    })

    it('removes external url references but keeps fragment references', () => {
        const external = sanitizeSvg(
            '<svg viewBox="0 0 24 24"><rect width="10" height="10" fill="url(https://evil.test/x.svg#a)"/></svg>'
        )
        const fragment = sanitizeSvg(
            '<svg viewBox="0 0 24 24"><rect width="10" height="10" fill="url(#paint)"/></svg>'
        )

        expect(external).not.toContain('evil.test')
        expect(fragment).toContain('url(#paint)')
    })
})
