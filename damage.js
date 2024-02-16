function getRawDamage(level, movePower, attack, defense) {
	const rawDamage = Math.floor(
		Math.floor(
			Math.floor(((2 * level) / 5 + 2) * movePower * attack) / defense
		) /
			50 +
			2
	);
	return rawDamage;
}

function applyRandomFactor() {
	const max = Math.floor(100);
	const min = Math.ceil(85);
	const randomFactor = Math.floor(Math.random() * (max - min + 1) + min);
	return randomFactor / 100;
}

function applyCriticalDamage() {
	const criticalChance = Math.round(Math.random() * 23);
	return criticalChance === 0 ? 1.5 : 1;
}

function applySTAB(pokeType, moveType) {
	return pokeType === moveType ? 1.5 : 1;
}

/* THE ONLY FUNCTION TO BE CALL FROM THE MODULE
   ========================================================================== */

export function getActualDamage(attackingPokemon, targetPokemon, move) {
	const attackerLevel = attackingPokemon.level;
	const basePower = move.basePower;
	const attackStat =
		move.category === "PHYSICAL"
			? attackingPokemon.stats.attack
			: attackingPokemon.stats.specialAttack;
	const defenseStat =
		move.category === "PHYSICAL"
			? targetPokemon.stats.defense
			: targetPokemon.stats.specialDefense;
	const pokemonType = attackingPokemon.type;
	const attackType = move.type;

	return Math.floor(
		getRawDamage(attackerLevel, basePower, attackStat, defenseStat) *
			applyCriticalDamage() *
			applyRandomFactor() *
			applySTAB(pokemonType, attackType)
	);
}
