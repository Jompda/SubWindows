"use strict"
import sw from '../index.js'


const subWindows = sw(document.getElementById('subwindows'))
const subWindow1 = subWindows.createSubWindow(0, 0, 400, 260)

