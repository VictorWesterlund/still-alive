import { default as Player } from "./PlayerWindow.mjs";

export default class PlayerManager {
	constructor() {
		this.players = {
			"lyrics": new Player("lyrics","monkeydo_lyrics.json")//,
			//"credits": new Player("credits","monkeydo_credits.json"),
			//"art": new Player("art")
		};

		this.channels = new WeakMap();
		for(const player of Object.values(this.players)) {
			// Create BroadcastChannels for each player
			const channel = new BroadcastChannel(player.name);
			this.channels.set(player,channel);
			channel.addEventListener("message",event => this.message(event));

			// Open each player
			if(player.open() === null) return this.windowOpenFailed();
		}
	}

	// Window blocked from opening, show "allow popups" message
	windowOpenFailed() {
		// Close all opened windows (some browsers allow one window to open)
		//for(const player of Object.values(this.players)) {
		//	player.window?.close();
		//}
		console.log("failed to open a window");
	}

	message(event) {
		console.log(event);
	}
}