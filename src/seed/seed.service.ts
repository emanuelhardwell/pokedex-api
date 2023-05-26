import { Injectable } from '@nestjs/common';
// import axios, { AxiosInstance } from 'axios';
import { PokemonRes } from './interfaces/pokemon-res.interface';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  // private readonly axiosInstance: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly axiosInstance: AxiosAdapter,
  ) {}

  async executeSeed() {
    // const res = await this.axiosInstance.get(
    //   'https://pokeapi.co/api/v2/pokemon?limit=10',
    // );
    // const body: PokemonRes = res?.data;

    // let newPokemons = [];
    // for (const pokemon of body?.results) {
    //   let no = pokemon.url.split('/');
    //   let s = no[no.length - 2];

    //   newPokemons.push({ name: pokemon.name, no: +s });
    // }
    // // console.log(newPokemons);

    const res = await this.axiosInstance.get<PokemonRes>(
      'https://pokeapi.co/api/v2/pokemon?limit=100',
    );

    // let data = res.data.results;
    let data = res.results;

    // FORMA 2
    // data.forEach(async (pokemon) => {
    //   const separateArray = pokemon.url.split('/');
    //   const no = +separateArray[separateArray.length - 2];

    //   // console.log({ name: pokemon.name, no });
    //   const pokemonSaved = await this.pokemonModel.create({
    //     name: pokemon.name,
    //     no,
    //   });
    // });

    await this.pokemonModel.deleteMany(); // borrar la colección

    // FORMA 3
    // const pokemonArrayPromises = [];

    // data.forEach(async (pokemon) => {
    //   const separateArray = pokemon.url.split('/');
    //   const no = +separateArray[separateArray.length - 2];

    //   pokemonArrayPromises.push(
    //     this.pokemonModel.create({
    //       name: pokemon.name,
    //       no,
    //     }),
    //   );
    // });

    // const pokemonSaved = await Promise.all(pokemonArrayPromises);

    // FORMA 4
    const pokemonArray = [];

    data.forEach(async (pokemon) => {
      const separateArray = pokemon.url.split('/');
      const no = +separateArray[separateArray.length - 2];

      pokemonArray.push({
        name: pokemon.name,
        no,
      });
    });

    const pokemonSaved = await this.pokemonModel.insertMany(pokemonArray);

    return { msg: `seed executed!!`, data: pokemonSaved };
  }
}
