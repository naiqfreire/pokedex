const pokemonDetailContainer = document.getElementById('container');
const documentTitle = document.querySelector('title');

function loadPokemonPage(pokemon) { 
            documentTitle.innerHTML = `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} details`
            const maxStatValue = 255;
            const newPokemonDetailsHtml = `
                <div class="pokemon ${pokemon.type}">
                    <a href="index.html" class="home-arrow"><i class="fa-solid fa-arrow-left"></i></a>
                    <div class="pokemon-details">
                        <h1>${pokemon.name}</h1>
                        <span class="number">#${pokemon.number}</span>
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>
                        <img class="pokemon-image" src="${pokemon.photo}" alt="${pokemon.name}">
                    </div>

                    <div class="pokemon-info">
                        <ul class="tabs">
                            <li class="tab active" data-tab="about">About</li>
                            <li class="tab" data-tab="stats">Base Stats</li>
                            <li class="tab" data-tab="evolution">Evolution</li>
                            <li class="tab" data-tab="moves">Moves</li>
                        </ul>

                        <div class="tab-content">
                            <div class="panel active" data-content="about">
                                <ul>
                                    <li>
                                        <span class="atribute-label">Species</span>
                                        <p class="atribute-value">${pokemon.species}</p>
                                    </li>
                                    <li>
                                        <span class="atribute-label">Height</span>
                                        <p class="atribute-value">${pokemon.height}</p>
                                    </li>
                                    <li>
                                        <span class="atribute-label">Weight</span>
                                        <p class="atribute-value">${pokemon.weight}</p>
                                    </li>
                                    <li>
                                        <span class="atribute-label">Abilities</span>
                                        <p class="atribute-value">${pokemon.abilities.map((ability) => `${ability.charAt(0).toUpperCase() + ability.slice(1)}`).join(', ')}</p>
                                    </li>
                                </ul>
                                <h2>Breeding</h2>
                                <ul>
                                    <li>
                                        <span class="atribute-label">Gender</span>
                                        <p class="atribute-value">${pokemon.gender}</p>
                                    </li>
                                    <li>
                                        <span class="atribute-label">Egg Groups</span>
                                        <p class="atribute-value">${pokemon.eggGroups.map((groupSlot) => `${groupSlot.charAt(0).toUpperCase() + groupSlot.slice(1)}`).join(', ')}</p>
                                    </li>
                                    <li>
                                        <span class="atribute-label">Egg Cycle</span>
                                        <p class="atribute-value">${pokemon.eggCycle}</p>
                                    </li>
                                </ul>
                            </div>
                            <div class="panel" data-content="stats">
                                <ul class="stats-list">
                                    ${pokemon.stats.map((stat) => `
                                        <li class="stat-row">
                                            <span class="stat-label">${stat.name}</span>
                                            <span class="stat-value">${stat.value}</span>
                                            <div class="stat-bar-container">
                                                <div class="stat-bar" style="width: ${stat.value / maxStatValue * 100}%"></div>
                                            </div>
                                        </li>
                                    `).join('')}

                                    <li class="stat-row total">
                                        <span class="stat-label">Total</span>
                                        <span class="stat-value">${pokemon.totalStats}</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="panel" data-content="evolution">
                                <ul class="evolution-chain">
                                ${pokemon.evolutions.map((stage, index) => `
                                     <li class="evolution-stage">
                                        <img class="${pokemon.number == stage.id ? 'current-evolution' : ''}" src="${stage.photo}" alt="${stage.name}">
                                        <span class="evolution-name">${stage.name}</span>
                                        <span class="evolution-number">#${stage.id.padStart(3, '0')}</span>
                                    </li>
                                    ${index < pokemon.evolutions.length - 1 ? 
                                        `
                                        <i class="fa-solid fa-arrow-down-long evolution-arrow mobile"></i>
    
                                        <i class="fa-solid fa-arrow-right-long evolution-arrow desktop"></i>
                                        ` : ''}
                                    `).join('')} 
                                </ul>
                            </div>
                            <div class="panel" data-content="moves">
                                <div class="moves-list">
                                    ${pokemon.moves.map((moves) => `
                                            <span class="move-name ${pokemon.type}">${moves.move.name}</span>
                                        `).join('')} 
                                </div>   
                            </div>
                        </div>
                    </div>
                </div>            
            `
            pokemonDetailContainer.innerHTML = newPokemonDetailsHtml;

            initializeTabs();
        }

const urlParams = new URLSearchParams(window.location.search);
const pokemonId = urlParams.get('id');

pokeApi.getPokemonById(pokemonId)
    .then((pokemon) => {
        if (pokemon) {
            loadPokemonPage(pokemon);
        } else {
            console.error('Pokémon não encontrado com o ID:', pokemonId);
            pokemonDetailContainer.innerHTML = '<h1 style="color: black;">Pokémon não encontrado!</h1>';
        }
    })
    .catch((error) => console.error('Erro ao buscar Pokémon:', error));


function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetData = tab.dataset.tab;
            const targetPanel = document.querySelector(`.panel[data-content="${targetData}"]`);

            document.querySelector('.tab.active').classList.remove('active');
            document.querySelector('.panel.active').classList.remove('active');

            tab.classList.add('active');
            targetPanel.classList.add('active');
        })
    })
}