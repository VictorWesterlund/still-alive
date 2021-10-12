import { default as Monkeydo } from "./monkeydo/Monkeydo.mjs";

export default class WindowManager {
	constructor() {
		const self = this;

		this.channels = {
			lyrics: new BroadcastChannel("lyrics"),
			credits: new BroadcastChannel("credits"),
			art: new BroadcastChannel("art")
		};

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

	spawnPlayer(type) {
		if(!type in this.channels) {
			throw new Error(`Inavlid player type "${type}"`);
		}

		// TODO
		//const player = new PlayerWindow(type);
	}

	play() {
		this.spawnPlayer("lyrics");
		this.spawnPlayer("credits");
		this.spawnPlayer("art");
	}
}