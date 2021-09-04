const { app, BrowserWindow } = require('electron')

function createWindow() {
	const win = new BrowserWindow({
		width: 700,
		height: 700,
		webPreferences: {
			nodeIntegration: true
		},
		allowRendererProcessReuse: true
	})
	win.loadFile('index.html')
	win.setMenu(null)
}

app.allowRendererProcessReuse = true;

app.whenReady().then(createWindow)
