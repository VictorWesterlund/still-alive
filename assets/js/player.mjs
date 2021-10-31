import { default as Player } from "./modules/StillAlivePlayer.mjs";

// Go to start page if location.hash is omitted
if(!window.location.hash) {
	// Close this window, if we can
	window.close();

	// Otherwise redirect to main page
	const page = window.location.pathname.split("/");
	const url = window.location.href.replace(page[page.length - 1],"");
	window.location.replace(url);
}

// Add location.hash to body classList
document.body.classList.add(window.location.hash.substring(1));

const element = document.getElementById("player");
const player = new Player(element);