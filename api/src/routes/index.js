const { Router } = require("express");
const axios = require("axios");
const { Pokemons, Types } = require("../db");

// const { getPoke } = require("./getInfo");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();
//
//

//
// // --------------------------------------------------DB INFO _____________ funciona
const getDbInfo = async () => {
  return await Pokemons.findAll({
    include: {
      model: Types,
      attributes: [`name`],
      through: {
        attributes: [],
      },
    },
  });
};
//
//
//
// --------------------------------------------------API INFO________________ funciona
const getApiInfo = async () => {
  const getPokeApi = [];

  for (let i = 1; i < 51; i++) {
    let pokeApi = await axios
      .get(`https://pokeapi.co/api/v2/pokemon/${i}`)
      .then((e) => {
        return {
          id: e.data.id,
          name: e.data.name,
          image: e.data.sprites.front_default,
          Types: e.data.types.map((e) => e.type.name),
          attack: e.data.stats[1].base_stat,
          defense: e.data.stats[2].base_stat,
          speed: e.data.stats[5].base_stat,
          hp: e.data.stats[0].base_stat,
          weight: e.data.weight,
          height: e.data.height,
        };
      });
    getPokeApi.push(pokeApi);
  }
  return getPokeApi;
};
//
//
//
// // --------------------------------------------------concat info________ funciona, dbinfo arreglada
const getPoke = async () => {
  let apiInfo = await getApiInfo();
  let dbInfo = await getDbInfo();
  const concatInfo = apiInfo.concat(dbInfo);
  return concatInfo;
};
//
//
//
// -// --------------------------------------------------GET X NAME__________
//
router.get("/pokemons", async (req, res) => {
  const name = req.query.name;
  console.log(name);
  const pokeTotal = await getPoke();
  if (name !== undefined) {
    console.log("entro");
    const pokeName = pokeTotal.filter((el) =>
      el.name.toLowerCase().includes(name.toLowerCase())
    );
    console.log(pokeName);
    pokeName
      ? res.status(200).send(pokeName)
      : res.status(404).send("no se encontro este pokemon");
  } else {
    console.log("no name, return allPokes");
    res.status(200).send(pokeTotal);
  }
});

//
//
//
// --------------------------------------GET X ID------
//
router.get("/pokemons/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const totalPoke = await getPoke();
  if (id) {
    let pokeId = await totalPoke.find((el) => el.id == id);
    pokeId
      ? res.status(200).send(pokeId)
      : res.status(404).send("no se encontro este id");
  }
});

//
//
//
// -----------------------GET X TYPES__________________
router.get("/types", async (req, res) => {
  const total = await axios.get("https://pokeapi.co/api/v2/type");
  const typeArr = total.data.results.map((el) => el.name);
  const saveArr = typeArr.map(async (e) => {
    await Types.findOrCreate({
      where: { name: e },
    });
  });
  saveArr
    ? res.status(200).send("Types saved")
    : res.status(404).send("saveArr is not found");
});
//
//
//
// -----------------------------------------POST POKEMONS__________________________
//
router.post("/pokemons", async (req, res) => {
  let {
    name,
    id,
    type,
    hp,
    attack,
    defense,
    speed,
    height,
    weight,
    image,
    createdInDb,
  } = req.body;
  let pokeCreated = await Pokemons.create({
    name,
    attack,
    hp,
    defense,
    weight,
    height,
    speed,
    image,
  });
  let typedb = await Types.findAll({
    where: { name: type },
  });
  pokeCreated.addTypes(typedb);
  res.send("pokemon creado con exito");
});

module.exports = router;
