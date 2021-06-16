"use strict"
import sw from '../index.js'


const subWindows = sw()
//const subWindow1 = subWindows.createSubWindow(0, 0, 400, 260)


document.getElementById('edit-area-1-button').onclick = async function () {
	const area1 = document.getElementById('area-1')
	area1.textContent = await subWindows.prompt('test prompt', area1.textContent)
}

