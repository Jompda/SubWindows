"use strict"


class SubWindow {
	constructor(options) {
		this.width = options.width || 200
		this.height = options.height || 200
		this.x = options.x || window.innerWidth / 2 - this.width / 2
		this.y = options.y || window.innerHeight / 4 - this.height / 2

		const root = this.rootNode = document.createElement('div')
		root.onmousedown = () => this.moveToTop()
		root.style.position = 'absolute'
		root.style.userSelect = 'none'
		root.style.overflow = 'hidden'
		this.updateTranslate()
		root.style.width = this.width + 'px'
		root.style.height = this.height + 'px'
		root.style.backgroundColor = 'transparent'
		root.style.border = 'solid 1px black'
		root.style.borderRadius = '10px'

		this.onclose = undefined
		this.onresize = undefined
		createSubWindowControls(this)

		const vp = this.viewportNode = document.createElement('div')
		vp.style.position = 'absolute'
		vp.style.userSelect = 'text'
		vp.style.backgroundColor = 'gray'
		vp.style.width = '100%'
		vp.style.height = `calc(100% - ${tbHeight})`
		vp.style.overflow = 'auto'
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


const tbHeight = '20px'
/**
 * @param {SubWindow} subWindow 
 */
function createSubWindowControls(subWindow) {
	subWindow.rootNode.appendChild(createTopBar())


	function createTopBar() {
		const tb = document.createElement('div')
		tb.style.width = '100%'
		tb.style.height = tbHeight
		tb.style.backgroundColor = 'cyan'

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

		const tempButton = document.createElement('button')
		tempButton.textContent = 'test'
		tempButton.onclick = () => {
			subWindow.moveToTop()
			console.log('test button clicked at window ', subWindow)
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


	function createSubWindow(subWindowOptions) {
		const subWindow = new SubWindow(subWindowOptions)
		holder.appendChild(subWindow.rootNode)
		return subWindow
	}


	/**
	 * @param {string} message 
	 * @param {string} defaultValue 
	 */
	async function prompt(message, defaultValue) {
		return new Promise(resolve => {
			const subWindow = createSubWindow({ width: 200, height: 140 })
			subWindow.viewportNode.innerHTML = `<div style="text-align:center;"><p>${message}</p></div>`

			const inputField = document.createElement('input')
			inputField.type = 'text'
			inputField.value = defaultValue || ''

			const okButton = document.createElement('button'), cancelButton = document.createElement('button')
			okButton.textContent = 'OK'; cancelButton.textContent = 'Cancel'
			okButton.style.margin = cancelButton.style.margin = '6px'
			okButton.onclick = () => {
				subWindow.close()
				resolve(inputField.value)
			}
			cancelButton.onclick = () => {
				subWindow.close()
				resolve(defaultValue)
			}
			subWindow.onclose = () => {
				resolve(defaultValue) // Can get resolved twice but no harm done there, at least to my knowledge.
			}
			subWindow.viewportNode.firstChild.append(inputField, okButton, cancelButton)
			inputField.select()
		})
	}


	return {
		createSubWindow,
		prompt
	}
}

