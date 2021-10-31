import { default as Player } from "./modules/PlayerManager.mjs";

const play = document.getElementById("play");

try {
	if(typeof BroadcastChannel !== "function") {
		throw new Error("BroadcastChannel API is not supported");
	}

	const mediaElement = document.getElementById("still-alive");

	const player = new Player(mediaElement);
	play.addEventListener("click",() => player.init());
} catch(error) {
	const message = document.getElementById("message");

	play.classList.add("unsupported");
	play.innerText = "Your browser can not play this demo";

	message.innerText = error;
}