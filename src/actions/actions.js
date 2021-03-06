//import fetch from 'cross-fetch'

export const SEND_REQUEST = 'SEND_REQUEST'
export const RECIEVE_RESPONSE = 'RECIEVE_RESPONSE'
export const UPDATE_OFFSET = 'UPDATE_OFFSET'
export const LIST_POKEMONS = 'LIST_POKEMONS'
export const GET_POKEMON = 'GET_POKEMON'
export const REQUEST_FAILED = 'REQUEST_FAILED'
export const REQUEST_SUCCEEDED = 'REQUEST_SUCCEEDED'
export const URL_LIST_POKEMONS = 'https://pokeapi.co/api/v2/pokemon/?limit=20&offset='
export const URL_POKEMON = 'https://pokeapi.co/api/v2/pokemon/'
export const NEXT = 1;
export const PREV = -1;
export const CURRENT = 0;


export function updateOffset(offset) {
  return {
    type: UPDATE_OFFSET,
    offset: offset,
  }
}

function runRequest() {
  return {
    type: SEND_REQUEST,
  }
}

function notifiyRequestFailed(error) {
  console.log(error);
  return {
    type: REQUEST_FAILED,
    error: error,
  }
}

function notifiyRequestSucceeded() {
  return {
    type: REQUEST_SUCCEEDED,
  }
}

function recieveResponse(response) {
  return {
    type: RECIEVE_RESPONSE,
    response: response,
  }
}

function listPokemons() {
  return {
    type: LIST_POKEMONS,
  }
}

function getPokemon() {
  return {
    type: GET_POKEMON,
  }
}

export function fetchPokemons(command = 0) {
  return (dispatch, getState) => {
    const state = getState();

    const offset = () => {
      if (command === PREV) return (Math.max(state.pokemonStore.offset - 20, 0))
      else if (command === NEXT) return state.pokemonStore.offset + 20
      else return state.pokemonStore.offset
    }

    dispatch(sendRequest(URL_LIST_POKEMONS + offset()))
      .then(() => {
        dispatch(updateOffset(offset()));
        dispatch(listPokemons());
      }
    )
  }
}

export function fetchPokemon(pokemonName) {
  return dispatch => {
    dispatch(sendRequest(URL_POKEMON + pokemonName))
    .then(() =>  dispatch(getPokemon()));
  }
}

function sendRequest(URL) {
  return dispatch => {
    dispatch(runRequest())
    return fetch(URL)
      .then(response => response.json())
      .then(json =>  dispatch(recieveResponse(Object.values(json))))
      .then(_ =>  dispatch(notifiyRequestSucceeded()))
      .catch(err => dispatch(notifiyRequestFailed(err)));
  }
}
