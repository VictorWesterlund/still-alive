import { default as Player } from "./PlayerWindow.mjs";

export default class PlayerManager {
	constructor() {
		this.players = {
			"lyrics": new Player("lyrics","monkeydo_lyrics.json"),
			"credits": new Player("credits","monkeydo_credits.json"),
			"art": new Player("art")
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

	// Close all opened windows (some browsers allow one window to open)
	closeAll() {
		for(const player of Object.values(this.players)) {
			player.window?.close();
		}
	}

	// Window blocked from opening, show "allow popups" message
	windowOpenFailed() {
		this.closeAll();
		throw new Error("WINDOW_OPEN_FAILED");
	}

	message(event) {
		if(event.data === "PLAYER_CLOSED") return this.closeAll();
	}
}