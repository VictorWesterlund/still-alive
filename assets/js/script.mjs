import { default as Player } from "./modules/WindowManager.mjs";

const play = document.getElementById("play");
const message = document.getElementById("message");

try {
	if(typeof BroadcastChannel !== "function") {
		throw new Error("BroadcastChannel API is not supported");
	}
	const player = new Player();
	play.addEventListener("click",() => player.play());
} catch(error) {
	play.classList.add("unsupported");
	play.innerText = "Your browser can not play this demo";
	message.innerText = error;
}