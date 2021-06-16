"use strict"


class SubWindow {
	constructor(x, y, w, h) {
		this.x = x; this.y = y; this.w = w; this.h = h

		const root = this.rootNode = document.createElement('div')
		root.onmousedown = () => this.moveToTop()
		root.style.position = 'absolute'
		root.style.userSelect = 'none'
		this.updateTranslate()
		root.style.width = w + 'px'
		root.style.height = h + 'px'
		root.style.backgroundColor = 'transparent'
		root.style.border = 'solid 1px black' // temp
		this.controls = new SubWindowControls(this)

		const vp = this.viewportNode = document.createElement('div')
		vp.style.position = 'absolute'
		vp.style.userSelect = 'text'
		vp.style.backgroundColor = 'gray'
		vp.style.width = '100%'
		vp.style.height = `calc(100% - ${SubWindowControls.tbHeight})`
		root.appendChild(vp)
	}


	updateTranslate() {
		this.rootNode.style.transform = `translate(${this.x}px, ${this.y}px)`
	}


	moveToTop() {
		const holder = this.rootNode.parentElement
		if (holder.childElementCount > 1)
			holder.lastChild.after(this.rootNode)
	}


	/**
	 * @param {HTMLElement} element 
	 */
	setContent(element) {
		if (this.viewportNode.hasChildNodes()) this.viewportNode.textContent = ''
		this.viewportNode.appendChild(element)
	}
}


class SubWindowControls {
	static tbHeight = '20px'


	/**
	 * @param {SubWindow} sw 
	 */
	constructor(sw) {
		this.subWindow = sw
		sw.rootNode.appendChild(this.topBar = this.createTopBar())
	}


	createTopBar() {
		const tb = document.createElement('div')
		tb.style.width = '100%'
		tb.style.height = SubWindowControls.tbHeight
		tb.style.backgroundColor = 'cyan'

		{	// Drag system
			let oldX, oldY
			const dragger = (event) => {
				const dx = event.x - oldX, dy = event.y - oldY
				this.subWindow.x += dx; this.subWindow.y += dy
				this.subWindow.updateTranslate()
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

		const tempButton = document.createElement('button')
		tempButton.innerText = 'test'
		tempButton.onclick = () => {
			this.subWindow.moveToTop()
			console.log('test button clicked at window ', this.subWindow)
		}
		for (let e of ['mousedown', 'mousemove'])
			tempButton.addEventListener(e, ev => ev.stopPropagation())
		tb.appendChild(tempButton)

		return tb
	}
}


/**
 * Ready the page for SubWindows.
 * @param {HTMLElement} holder 
 */
export default function setupSubWindows(holder) {
	if (!holder) holder = document.createElement('div')
	holder.style.position = 'absolute'
	document.body.appendChild(holder)


	/**
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} w 
	 * @param {number} h 
	 */
	function createSubWindow(x, y, w, h) {
		const subWindow = new SubWindow(x, y, w, h)
		holder.appendChild(subWindow.rootNode)
		return subWindow
	}


	return {
		createSubWindow
	}
}

