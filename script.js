let pokemonList = [];
let selectedPokemon = '';
let tries = 0;

async function fetchPokemonData() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
  const data = await response.json();
  return data.results.map(pokemon => pokemon.name.toLowerCase());
}

async function initializeGame() {
  pokemonList = await fetchPokemonData();
  selectedPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
  console.log(selectedPokemon); // For debugging
  displayEmptySlots(selectedPokemon.length);
}

function displayEmptySlots(length) {
  const board = document.getElementById('board');
  board.innerHTML = '';
  for (let i = 0; i < length; i++) {
    const slot = document.createElement('div');
    slot.textContent = '_';
    board.appendChild(slot);
  }
}

function validateGuess(guess) {
  return pokemonList.includes(guess);
}

function getFeedback(guess, word) {
  let feedback = [];
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === word[i]) {
      feedback.push('correct');
    } else if (word.includes(guess[i])) {
      feedback.push('present');
    } else {
      feedback.push('absent');
    }
  }
  return feedback;
}

async function fetchPokemonDetails(pokemon) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  const data = await response.json();
  return {
    type: data.types.map(typeInfo => typeInfo.type.name).join(', '),
    generation: data.game_indices[0]?.version?.name,
    // Add other details like silhouette image, region, etc.
  };
}

async function displayHint() {
  const details = await fetchPokemonDetails(selectedPokemon);
  document.getElementById('hint').innerText = `
    Type: ${details.type}
    Generation: ${details.generation}
    // Add other hints here
  `;
}

function makeGuess() {
  const guessInput = document.getElementById('guessInput').value.toLowerCase();
  if (validateGuess(guessInput) && guessInput.length === selectedPokemon.length) {
    const feedback = getFeedback(guessInput, selectedPokemon);
    displayFeedback(guessInput, feedback);
    tries++;
    if (tries >= 3) {
      displayHint();
    }
    if (guessInput === selectedPokemon) {
      alert('Congratulations! You guessed the Pokémon!');
    }
  } else {
    alert('Invalid Pokémon name or length');
  }
}

function displayFeedback(guess, feedback) {
  const board = document.getElementById('board');
  board.innerHTML = '';
  for (let i = 0; i < guess.length; i++) {
    const letter = document.createElement('div');
    letter.textContent = guess[i];
    letter.classList.add(feedback[i]);
    board.appendChild(letter);
  }
}

initializeGame();

