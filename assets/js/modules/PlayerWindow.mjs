const windowPositions = {
	"#lyrics": {
		width: window.innerWidth / 2,
		height: window.innerHeight,
		top: 0,
		left: 0
	},
	"#credits": {
		width: window.innerWidth / 2,
		height: window.innerHeight / 2,
		top: 0,
		left: window.innerWidth / 2
	},
	"#art": {
		width: window.innerWidth / 2,
		height: window.innerHeight / 2,
		top: window.innerHeight / 2,
		left: window.innerWidth / 2
	}
}

export default class PlayerWindow {
	constructor(name) {
		this.features = {
			menubar: false,
			location: false,
			resizable: false,
			scrollbar: false,
			status: false
		}

		this.url = new URL(window.location.href + "player");
		this.url.hash = name;

		// Copy window size rect into windowFeatures
		Object.assign(this.features,windowPositions[this.url.hash]);
	}

	// Convert windowFeatures object into a CSV DOMString
	windowFeatures() {
		let output = [];
		for(let [key,value] of Object.entries(this.features)) {
			if(typeof key === "boolean") {
				value = value ? "yes" : "no";
			}
			output.push(`${key}=${value}`);
		}
		return output.join(",");
	}

	open() {
		const features = this.windowFeatures();
		const open = window.open(this.url.toString(),this.url.hash,features);

		// Window failed to open (usually due to pop-up blocking), tell the WindowManager about this
		if(!open) {
			const channel = new BroadcastChannel(this.url.hash);
			channel.postMessage(["WINDOW_ERROR",[this.url.hash,"BLOCKED"]]);
		}
	}
}
