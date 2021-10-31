import { default as PlayerWindow } from "./PlayerWindow.mjs";
import { default as Monkeydo } from "./monkeydo/Monkeydo.mjs";

export default class WindowManager {
	constructor(mediaElement) {
		const self = this;
		this.mediaElement = mediaElement;

		// Bi-directional communcation to player windows
		this.channels = {
			"#lyrics": new BroadcastChannel("#lyrics"),
			"#credits": new BroadcastChannel("#credits"),
			"#art": new BroadcastChannel("#art")
		};

		for(const channel of Object.values(this.channels)) {
			channel.addEventListener("message",event => this.message(event));
		}

		// Monkeydo methods
		const methods = {
			blank: (target) => {
				self.channels[target].postMessage(["BLANK",target]);
			},
			lineFeed: (target) => {
				self.channels[target].postMessage(["LINE_FEED"]);
			},
			textFeed: (text,target = "#lyrics") => {
				self.channels[target].postMessage(["TEXT_FEED",text]);
			},
			drawArt: (index,target = "#art") => {
				self.channels[target].postMessage(["DRAW_ART",index]);
			},
			playCredits: () => {
				self.players.credits.do();
			}
		}

		this.players = {
			lyrics: new Monkeydo(methods),
			credits: new Monkeydo(methods)
		}
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

	async play() {
		for(const [key,player] of Object.entries(this.players)) {
			const manifest = new URL(window.location.href + `monkeydo_${key}.json`);

			await player.load(manifest.toString());
		}
		this.players.lyrics.do();
		this.mediaElement.play();
	}

	// Open player windows and start playback
	async init() {
		const art = this.spawnPlayer("#art");
		const credits = this.spawnPlayer("#credits");
		const lyrics = this.spawnPlayer("#lyrics");
		
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

			// Load Monkeydo manifest and start playback
			this.play();
		});
	}

	message(event) {
		const type = event.data[0];
		const data = event.data[1];

		switch(type) {
			case "PLAY": console.log("PLAY",event); break;
			case "WINDOW_CLOSED": console.log("WINDOW_CLOSED",event); break;
		}
	}
}