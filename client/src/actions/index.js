import axios from "axios";

export function getAllPokemons() {
  return async function (dispatch) {
    var json = await axios.get("http://localhost:3001/Pokemons");
    return dispatch({
      type: "GET_POKEMONS",
      payload: json.data,
    });
  };
}
