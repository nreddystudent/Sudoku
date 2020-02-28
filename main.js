const { app, BrowserWindow } = require('electron')

function createWindow () {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 700,
		height: 700,
		webPreferences: {
		nodeIntegration: true
		}
	})

	// and load the index.html of the app.
	win.loadFile('index.html')
	win.setMenu(null)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)
