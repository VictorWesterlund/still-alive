import { default as Player } from "./modules/PlayerManager.mjs";

const play = document.getElementById("play");

if(typeof BroadcastChannel !== "function") {
	const message = document.getElementById("message");
	play.classList.add("unsupported");
	play.innerText = "Your browser can not play this demo";
	message.innerText = error;
}

play.addEventListener("click",() => new Player());