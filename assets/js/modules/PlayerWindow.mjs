const windowPositions = {
	"lyrics": {
		width: window.innerWidth / 2,
		height: window.innerHeight,
		top: 0,
		left: 0
	},
	"credits": {
		width: window.innerWidth / 2,
		height: window.innerHeight / 2,
		top: 0,
		left: window.innerWidth / 2
	},
	"art": {
		width: window.innerWidth / 2,
		height: window.innerHeight / 2,
		top: window.innerHeight / 2,
		left: window.innerWidth / 2
	}
}

export default class PlayerWindow {
	constructor(name,manifest = null) {
		this.features = {
			menubar: false,
			location: false,
			resizable: false,
			scrollbar: false,
			status: false
		}
		this.name = name;
		this.window = null;

		this.url = new URL(window.location.href + "player");
		this.url.hash = name;

		// Path to Monkeydo manifest to load in this window
		if(manifest) this.url.searchParams.append("manifest",manifest);

		// Copy window size rect into windowFeatures
		Object.assign(this.features,windowPositions[name]);
	}

	// Convert windowFeatures object into a CSV DOMString
	getWindowFeatures() {
		let output = [];
		for(let [key,value] of Object.entries(this.features)) {
			// Coercive boolean
			if(typeof key === "boolean") {
				value = value ? "yes" : "no";
			}
			output.push(`${key}=${value}`);
		}
		return output.join(",");
	}

	// Close this window
	close() {
		return this.window?.close() ?? false;
	}

	// Compile windowFeatures and open the window
	open() {
		const features = this.getWindowFeatures();
		this.window = window.open(this.url.toString(),this.name,features);

		// Will return null if window failed to open (usually due to popup blocking)
		return this.window;
	}
}
