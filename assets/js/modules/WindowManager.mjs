import { default as Monkeydo } from "./monkeydo/Monkeydo.mjs";

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

class PlayerWindow {
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

		Object.assign(this.features,windowPositions[this.url.hash]);
	}

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

		if(!open) {
			const channel = new BroadcastChannel(this.url.hash);
			channel.postMessage(["WINDOW_ERROR",[this.url.hash,"BLOCKED"]]);
		}
	}
}

export default class WindowManager {
	constructor() {
		const self = this;

		// Bi-directional communcation to player windows
		this.channels = {
			lyrics: new BroadcastChannel("#lyrics"),
			credits: new BroadcastChannel("#credits"),
			art: new BroadcastChannel("#art")
		};

		// Monkeydo methods
		const methods = {
			self: self,
			pushText: (target,text) => {
				const channels = self.channels[target];
				for(const channel of channels) {
					channel.postMessage(["PUSH_TEXT",text]);
				}
			}
		}

		this.player = new Monkeydo(methods);
	}

	playbackFailed(promiseObject = false) {
		console.log(promiseObject);
	}

	// Attempt to open a new window
	async spawnPlayer(type) {
		if(!type in this.channels) {
			throw new Error(`Inavlid player type "${type}"`);
		}

		return await new Promise((resolve,reject) => {
			const player = new PlayerWindow(type).open();
			const channel = this.channels[type];
			
			// Wait for window to emit ready state message before resolving
			const ack = channel.addEventListener("message",event => {
				if(event.data[0] === "WINDOW_READY" || event.data[1] === type) {
					resolve("WINDOW_READY");
				}
				// Window failed to initialize
				if(event.data[0] === "WINDOW_ERROR" || event.data[1][0] === type) {
					reject(event.data[1]);
				}
				return false;
			});
			channel.removeEventListener("message",ack);
		});
	}

	// Open player windows and start playback
	async play() {
		const art = this.spawnPlayer("art");
		const credits = this.spawnPlayer("credits");
		const lyrics = this.spawnPlayer("lyrics");
		
		const timeout = new Promise(resolve => setTimeout(() => resolve("TIMEOUT")),3000);
		const windows = await Promise.allSettled([lyrics,credits,art]);
		
		// Wait for all windows to open and initialize (or timout and fail)
		const status = Promise.race([windows,timeout]);
		status.then(promises => {
			promises.forEach(promiseObject => {
				if(promiseObject.status !== "fulfilled") {
					this.playbackFailed(promiseObject);
				}
			});
		});
	}
}