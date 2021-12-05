import { default as Player } from "./modules/PlayerManager.mjs";

const play = document.getElementById("play");

function info(text = "") {
	const element = document.getElementById("message");
	element.innerText = text;
}

if(typeof BroadcastChannel !== "function") {
	play.classList.add("unsupported");
	info("Your browser can not play this demo");
}

play.addEventListener("click",() => {
	try {
		info();
		new Player();
	}
	catch(except) {
		if(except.message === "WINDOW_OPEN_FAILED") return info("Yikes! Player windows could not be created. Allow this page to open pop-ups, it will be worth it!");
		// Cannot handle this exception, rethrow
		throw except;
	}
});