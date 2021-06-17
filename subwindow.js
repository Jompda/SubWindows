"use strict"
const tbHeight = '20px'


export default class SubWindow {
	constructor(options) {
		this.title = options.title
		this.width = options.width || 200
		this.height = options.height || 200
		this.x = options.x || window.innerWidth / 2 - this.width / 2
		this.y = options.y || window.innerHeight / 4 - this.height / 2

		const root = this.rootNode = document.createElement('div')
		root.className = 'subwindow-root-node'
		root.style.width = this.width + 'px'
		root.style.height = this.height + 'px'
		root.onmousedown = () => this.moveToTop()
		this.updateTranslate()

		this.onclose = undefined
		this.onresize = undefined
		createSubWindowControls(this)

		const vp = this.viewportNode = document.createElement('div')
		vp.className = 'subwindow-viewport-node'
		vp.style.height = `calc(100% - ${tbHeight})`
		root.appendChild(vp)
	}


	updateTranslate() {
		this.rootNode.style.transform = `translate(${Math.floor(this.x)}px, ${Math.floor(this.y)}px)`
	}


	moveToTop() {
		const holder = this.rootNode.parentElement
		if (holder.childElementCount > 1)
			holder.lastChild.after(this.rootNode)
	}


	close() {
		if (this.onclose) Object.apply(null, this.onclose, arguments)
		this.rootNode.remove()
	}


	/**
	 * @param {HTMLElement} element 
	 */
	setContent(element) {
		if (this.viewportNode.hasChildNodes()) this.viewportNode.textContent = ''
		this.viewportNode.appendChild(element)
	}
}


/**
 * @param {SubWindow} subWindow 
 */
function createSubWindowControls(subWindow) {
	subWindow.rootNode.appendChild(createTopBar())


	function createTopBar() {
		const tb = document.createElement('div')
		tb.className = 'toolbar'
		tb.style.height = tbHeight

		{	// Drag system
			let oldX, oldY
			const dragger = (event) => {
				const dx = event.x - oldX, dy = event.y - oldY
				subWindow.x += dx; subWindow.y += dy
				subWindow.updateTranslate()
				oldX = event.x; oldY = event.y
			}
			tb.addEventListener('mousedown', (event) => {
				oldX = event.x; oldY = event.y
				window.onmousemove = dragger
				window.onmouseup = () => window.onmousemove = undefined
				// Prevent the SubWindow from going out of the viewable area.
				document.body.onmouseleave = () => window.onmousemove = undefined
			})
		}

		const left = document.createElement('div')
		const center = document.createElement('div')
		const right = document.createElement('div')
		tb.append(left, center, right)

		const title = document.createElement('div')
		title.style.padding = '1px'
		title.textContent = subWindow.title
		left.appendChild(title)

		const closeButton = document.createElement('div')
		closeButton.style.padding = '1px'
		closeButton.style.backgroundColor = 'red'
		closeButton.textContent = 'Close'
		closeButton.onclick = () => subWindow.close()
		for (let e of ['mousedown', 'mousemove'])
			closeButton.addEventListener(e, ev => ev.stopPropagation())
		right.appendChild(closeButton)

		return tb
	}
}

