"use strict"
import SubWindow from './subwindow.js'


/**
 * Ready the page for SubWindows.
 * @param {HTMLElement} holder 
 */
export default function setupSubWindows(holder) {
	if (!holder) holder = document.createElement('div')
	holder.style.position = 'absolute'
	document.body.appendChild(holder)
	const pathname = new URL(import.meta.url).pathname
	const directory = pathname.slice(0, pathname.lastIndexOf('/') + 1)
	requestHttpResource({ url: directory + 'stylesheet.css' }).then(xhr => {
		const style = document.createElement('style')
		style.textContent = xhr.responseText
		document.head.appendChild(style)
	})


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
			const subWindow = createSubWindow({ width: 200, height: 140, title: 'Prompt' })
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


/**
 * @param {{method: string, url: string, body: string, headers: Object}} param0 
 * @returns {Promise<XMLHttpRequest>}
 */
async function requestHttpResource({ method = 'GET', url, body, headers }) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open(method, url)
		if (headers) Object.getOwnPropertyNames(headers).forEach((headerName) =>
			xhr.setRequestHeader(headerName, headers[headerName])
		)
		xhr.send(body)
		xhr.onerror = () => reject(xhr)
		xhr.onload = () => {
			if (xhr.status != 200) return reject(xhr)
			resolve(xhr)
		}
	})
}

