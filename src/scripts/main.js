const pokemonList = document.getElementById('pokemonList');
const loadMoreBtn = document.getElementById('loadMoreBtn');
let limit = 12;
let offset = 0;

loadMoreBtn.addEventListener('click', () => {
    offset += limit;
    loadPokemonItens(offset, limit);
})

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemon(offset, limit)
        .then((pokemons = []) => {
            const newHtml = pokemons.map((pokemon) => `
            <li>
                <a class="pokemon ${pokemon.type}" href="pokemon.html?id=${pokemon.number}">
                    <span id="number" class="number">#${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>
                    <div class="pokemon-details">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>
                        <div class="img-container"><img src="${pokemon.photo}" alt="${pokemon.name}"></div>
                    </div>
                </a>
            </li>
            `).join('');
            pokemonList.innerHTML += newHtml;
        })
        .catch((error) => console.log(error));
}

loadPokemonItens(offset, limit);