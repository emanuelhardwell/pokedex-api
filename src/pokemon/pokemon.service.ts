import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      // console.log(error);
      if (error.code === 11000) {
        throw new BadRequestException(
          `Ya existe un ${JSON.stringify(error.keyValue)} en la BD`,
        );
      }
      throw new InternalServerErrorException('Error en el servidor');
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(search: string) {
    let pokemon: Pokemon;

    //no
    if (!isNaN(+search)) {
      pokemon = await this.pokemonModel.findOne({ no: search });
    }

    //mongoID
    if (!pokemon && isValidObjectId(search)) {
      pokemon = await this.pokemonModel.findById(search);
    }

    //nombre
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: search.toLocaleLowerCase().trim(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `El pokemon con Id, Nombre o Número "${search}" no exite`,
      );
    }

    return pokemon;
  }

  async update(search: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(search);

      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      }

      await pokemon.updateOne(updatePokemonDto);

      return { ...pokemon.toJSON(), ...updatePokemonDto };
      // const pokemonDB = await pokemon.updateOne(updatePokemonDto, {
      //   new: true,
      // });

      // return pokemonDB;
    } catch (error) {
      console.log(error.message);
      if (error.code === 11000) {
        throw new BadRequestException(
          `Ya existe un ${JSON.stringify(error.keyValue)} en la BD`,
        );
      }
      throw new InternalServerErrorException('Error en el servidor');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
