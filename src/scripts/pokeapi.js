class Pokemon {
    number;
    name;
    type;
    types =[];
    photo;

    species;
    height;
    weight;
    abilities = [];
    gender;
    eggGroups = [];
    eggCycle;

    stats = [];
    totalStats = 0;

    evolutions = [];

    moves = [];
}

const pokeApi = {};

pokeApi.getPokemonById = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;

    return Promise.all([
        fetch(url).then((response) => response.json()),
        fetch(speciesUrl).then((response) => response.json()),
    ]) 
    .then(([pokemonDetail, speciesDetail]) => {
        const evolutionUrl = speciesDetail.evolution_chain.url;

        return fetch(evolutionUrl)
            .then((response) => response.json())
            .then((evolutionDetail) => {
                return convertPokeApiDetailToPokemonModel(pokemonDetail, speciesDetail, evolutionDetail)
            }) 
    })
}

pokeApi.getPokemonDetails = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemon = (offset = 0, limit = 12) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetails))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonDetails) => pokemonDetails)
}

function convertPokeApiDetailToPokemonModel(pokeDetail, speciesDetail, evolutionDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;

    pokemon.photo = `https://cdn.jsdelivr.net/gh/PokeAPI/sprites/sprites/pokemon/other/official-artwork/${pokeDetail.id}.png`;

    const speciesEntry = speciesDetail.genera.find((genus) => genus.language.name === 'en');
    pokemon.species = speciesEntry ? speciesEntry.genus : pokeDetail.species.name;

    pokemon.height = `${(pokeDetail.height / 10).toFixed(1)}m`;
    pokemon.weight = `${(pokeDetail.weight / 10).toFixed(1)}kg`;

    const abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name);

    pokemon.abilities = abilities;

    pokemon.eggGroups = speciesDetail.egg_groups.map((groupSlot) => groupSlot.name);
    pokemon.eggCycle = speciesDetail.hatch_counter;

    switch(speciesDetail.gender_rate) {
        case -1:
            pokemon.gender = 'Genderless';
            break
        
        case 0:
            pokemon.gender = 'Male';
            break

        case 8:
            pokemon.gender = 'Female';
            break    
        
        default:
            pokemon.gender = 'Male / Female'
    }

        const statNameMapping = {
        'hp': 'HP',
        'attack': 'Attack',
        'defense': 'Defense',
        'special-attack': 'Sp. Atk',
        'special-defense': 'Sp. Def',
        'speed': 'Speed',
    }

    pokemon.stats = pokeDetail.stats.map((statSlot) => {
        const statName = statNameMapping[statSlot.stat.name] || statSlot.stat.name;

        return {
            name: statName,
            value: statSlot.base_stat,
        };
    });

    pokemon.totalStats = pokemon.stats.reduce((total, stat) => total + stat.value, 0);

    function getIdFromSpeciesUrl(url) {
        return url.split('/').filter(Boolean).pop();
    }

    let currentStage = evolutionDetail.chain;

    do {
        const id = getIdFromSpeciesUrl(currentStage.species.url);

        pokemon.evolutions.push({
            id: id,
            name: currentStage.species.name,
            photo: `https://cdn.jsdelivr.net/gh/PokeAPI/sprites/sprites/pokemon/other/official-artwork/${id}.png`,
        })

        if(currentStage.evolves_to.length > 0) {
            currentStage = currentStage.evolves_to[0];
        }else {
            currentStage = null;
        }
    } while(currentStage);

    const pokemonMoves = pokeDetail.moves;

    pokemon.moves = pokemonMoves;

    return pokemon;
}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;

    pokemon.photo = `https://cdn.jsdelivr.net/gh/PokeAPI/sprites/sprites/pokemon/other/official-artwork/${pokeDetail.id}.png`;

    return pokemon;
}