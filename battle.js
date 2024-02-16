import * as dmg from "./damage.js";
import * as fd from "./fecthData.js";
import * as ui from "./uiupdate.js";

let playerPokemon = fd.getPlayerPokemon("charmander");
let enemyPokemon = fd.getPlayerPokemon("squirtle");

// Initialize the current health of both as the max stat
playerPokemon.currentHP = playerPokemon.stats.hp;
enemyPokemon.currentHP = enemyPokemon.stats.hp;

ui.updateUIOnChoice(ui.enemyPokemonUI, enemyPokemon, true);
ui.updateUIOnChoice(ui.playerPokemonUI, playerPokemon);

const moveButtons = document.querySelectorAll(".move");

function getFirstToMove() {
	let movesFirst = "";
	if (playerPokemon.stats.speed > enemyPokemon.stats.speed) {
		movesFirst = "Player";
	} else {
		movesFirst = "Enemy";
	}
	return movesFirst;
}

function playEnemyTurn() {
	if (enemyPokemon.currentHP > 0) {
		const chosenMove = getEnemyMove();

		if (
			chosenMove.category === "PHYSICAL" ||
			chosenMove.category === "SPECIAL"
		) {
			const inflictedDmg = dmg.getActualDamage(
				enemyPokemon,
				playerPokemon,
				chosenMove
			);
			ui.updateHPOnMove(inflictedDmg, ui.playerPokemonUI);

			ui.displayTextSlowly(
				`${ui.enemyPokemonUI.name.textContent} dealt ${inflictedDmg} point of damage!`
			);
			playerPokemon.currentHP -= inflictedDmg;
			if (playerPokemon.currentHP <= 0 && !ui.isWriting) {
				checkForKO(ui.playerPokemonUI);
			}
		}
	}
}

function getEnemyMove() {
	// Random for now
	const enemyMoves = Object.keys(enemyPokemon.knownMoves);
	const chosenEnemyMove = fd.getMove(
		enemyPokemon.knownMoves[
			enemyMoves[(enemyMoves.length * Math.random()) << 0]
		]
	);
	return chosenEnemyMove;
}

function playPlayerTurn(playerMove) {
	if (playerPokemon.currentHP > 0) {
		if (
			playerMove.category === "PHYSICAL" ||
			playerMove.category === "SPECIAL"
		) {
			const inflictedDmg = dmg.getActualDamage(
				playerPokemon,
				enemyPokemon,
				playerMove
			);
			ui.updateHPOnMove(inflictedDmg, ui.enemyPokemonUI);
			ui.displayTextSlowly(
				`${ui.playerPokemonUI.name.textContent} dealt ${inflictedDmg} point of damage!`
			);
			enemyPokemon.currentHP -= inflictedDmg;
			if (enemyPokemon.currentHP <= 0 && !ui.isWriting) {
				checkForKO(ui.enemyPokemonUI);
			}
		}
	}
}

function playTurn(playerMove, enemyMove) {
	if (getFirstToMove() === "Player") {
		playPlayerTurn(playerMove);
		setTimeout(() => playEnemyTurn(enemyMove), 2000);
	} else {
		playEnemyTurn(enemyMove);
		setTimeout(() => playPlayerTurn(playerMove), 2000);
	}
}

function listenForPlayerMove() {
	moveButtons.forEach((moveBtn) => {
		moveBtn.addEventListener("mousedown", (clickEvent) => {
			const clickedMove = clickEvent.target.classList[1];
			const playerMove = fd.getMove(playerPokemon.knownMoves[clickedMove]);
			playTurn(playerMove, getEnemyMove());
		});
	});
}

function checkForKO(faintedPokemon) {
	ui.displayTextSlowly(faintedPokemon.name.textContent + " has fainted!");
	ui.playKOAnimation(faintedPokemon);
}

listenForPlayerMove();
console.log(getFirstToMove());
console.log(getEnemyMove());
