import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokemonRes } from './interfaces/pokemon-res.interface';

@Injectable()
export class SeedService {
  private readonly axiosInstance: AxiosInstance = axios;

  async executeSeed() {
    const res = await this.axiosInstance.get(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );
    const body: PokemonRes = res?.data;

    let newPokemons = [];
    for (const pokemon of body?.results) {
      let no = pokemon.url.split('/');
      let s = no[no.length - 2];

      newPokemons.push({ name: pokemon.name, no: +s });
    }
    // console.log(newPokemons);

    return `seed executed!!`;
  }
}
