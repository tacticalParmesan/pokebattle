import * as fd from "./fecthData.js";

/* REFERENCES
   ========================================================================== */

// References that are needed globally
const textField = document.querySelector(".text-box");
const movesList = document.querySelectorAll(".move");
let animationInterval;
let restoreSpriteInterval;

// Enemy and Player UI bundled as Objects for easier access
export const enemyPokemonUI = {
	name: document.querySelector(".pokemon-name.enemy"),
	level: document.querySelector(".pokemon-level.enemy"),
	maxHealth: "",
	currentHealth: "",
	healthBar: document.querySelector(".hpbar.enemy"),
	sprite: document.querySelector(".sprite.enemy"),
};

export const playerPokemonUI = {
	name: document.querySelector(".pokemon-name.player"),
	level: document.querySelector(".pokemon-level.player"),
	maxHealth: "",
	currentHealth: "",
	healthBar: document.querySelector(".hpbar.player"),
	sprite: document.querySelector(".sprite.player"),
};

// Global flag to avoid the screen to be overwritten too early
export let isWriting = false;

/* UI UPDATE ON POKEMON SELECTION
   ========================================================================== */

export function updateUIOnChoice(uiElement, pokemonChoice, isEnemy = false) {
	// Update the information panel
	for (let uiItem in uiElement) {
		if (pokemonChoice[uiItem]) {
			uiElement[uiItem].textContent = pokemonChoice[uiItem];
		}

		if (isEnemy) {
			uiElement.sprite.setAttribute("src", pokemonChoice.sprites.spriteFront);
		} else {
			uiElement.sprite.setAttribute("src", pokemonChoice.sprites.spriteBack);
		}

		// Update the moves panel
	}
	if (!isEnemy) {
		const chosenPkmMoves = Object.values(pokemonChoice.knownMoves);

		for (let i = 0; i < movesList.length - 1; i++) {
			if (chosenPkmMoves[i]) {
				movesList[i].textContent = fd.getMove(chosenPkmMoves[i]).name;
			}
		}
	}

	// Update the health values
	uiElement.maxHealth = pokemonChoice.stats.hp;
	uiElement.currentHealth = pokemonChoice.stats.hp;
}

/* HEALTHBAR UI UPDATE
   ========================================================================== */

export function updateHPOnMove(damage, target) {
	/* This function receives the dealt damage and the target pokemon UI to update the healthbar by
	calculating the difference between current health and damage and then lowers the displayed Hp
	one at a time. */
	const hpAfterDamage = target.currentHealth - damage;
	target.currentHealth = hpAfterDamage;

	const hpBarAfterDamage = Math.round((100 / target.maxHealth) * hpAfterDamage);

	let interval = setInterval(() => {
		if (+target.healthBar.style.width.slice(0, -2) != hpBarAfterDamage) {
			target.healthBar.style.width =
				// We need to slice the "px" from the CSS property
				+target.healthBar.style.width.slice(0, -2) - 1 + "px";

			// Other function to be called while updating the healthbar
			checkHealthBarColor(target.healthBar);
			playDamageAnimation(target);
		} else {
			clearInterval(interval);
			stopDamageAnimation(target);
		}
	}, 50);
}

function checkHealthBarColor(targetHealthBar) {
	const hpBarValue = +targetHealthBar.style.width.slice(0, -2);

	if (hpBarValue <= 50 && hpBarValue > 15) {
		targetHealthBar.style.backgroundColor = "gold";
	} else if (hpBarValue <= 15) {
		targetHealthBar.style.backgroundColor = "crimson";
	}
}

/* ANIMATIONS
   ========================================================================== */

export function playDamageAnimation(target) {
	target.sprite.classList.add("hitTaken");
}

export function stopDamageAnimation(target) {
	target.sprite.classList.remove("hitTaken");
}

export function playKOAnimation(target) {
	target.sprite.classList.add("fainted");
}

/* UTILITY FUNCTIONS
   ========================================================================== */

export function displayTextSlowly(text, delay = 50) {
	// Show the text one character at the time, to achieve a really nostalgic effect!
	if (!isWriting) {
		disableMoveButtons();
		let count = 0;

		let typer = setInterval(() => {
			if (count <= text.length) {
				isWriting = true;
				count++;
				textField.textContent = text.substring(0, count);
			} else {
				isWriting = false;
				clearInterval(typer);
				enableMoveButtons();
			}
		}, delay);
	}
}

export function disableMoveButtons() {
	movesList.forEach((moveButton) => {
		moveButton.setAttribute("disabled", "");
	});
}

export function enableMoveButtons() {
	movesList.forEach((moveButton) => {
		moveButton.removeAttribute("disabled", "");
	});
}


