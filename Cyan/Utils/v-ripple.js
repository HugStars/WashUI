import './v-ripple.css'

export default {
    mounted: e => {
        e.addEventListener('click', event => {
            e.classList.add('event_parent')
            const span = document.createElement('span')
            span.classList.add('ink')
            span.classList.add('active')
            span.style.top = event.layerY - e.offsetWidth / 2 + 'px'
            span.style.left = event.layerX - e.offsetWidth / 2 + 'px'
            e.append(span)
            setTimeout(() => {
                span.remove()
            }, 500)
        })
    }
}