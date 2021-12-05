import { default as Player } from "./modules/StillAlivePlayer.mjs";

if(typeof BroadcastChannel !== "function" || !window.location.hash) {
	close();
	const page = window.location.pathname.split("/");
	const url = window.location.href.replace(page[page.length - 1],"");
	window.location.replace(url);
};

const name = window.location.hash.substring(1);
document.body.className = name;

const target = document.getElementById("player");
const player = new Player(target,name);

// Notify PlayerManager that I was closed
window.addEventListener("beforeunload",() => player.channel.postMessage("PLAYER_CLOSED"));