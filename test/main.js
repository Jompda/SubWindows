"use strict"
import * as sw from '../index.js'


const subWindow1 = new sw.SubWindow(0, 0, 400, 260)
subWindow1.viewportNode.innerHTML = '<div>yes</div>'
const subWindow2 = new sw.SubWindow(0, 300, 400 * 0.8, 260 * 0.8)
const subWindow3 = new sw.SubWindow(0, 540, 400 * 0.6, 260 * 0.6)
document.getElementById('subwindow-holder').append(subWindow1.rootNode, subWindow2.rootNode, subWindow3.rootNode)

