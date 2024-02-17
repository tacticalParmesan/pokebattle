import data from "./pokemondata.json" assert { type: "json" };
import movesData from "./moves.json" assert { type: "json" };

export function getEnemyPokemon(pokemonName) {
    return data[pokemonName]
}

export function getPlayerPokemon(pokemonName) {
    return data[pokemonName]
}

export function getMove(moveName) {
    return movesData[moveName]
}

