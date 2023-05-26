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
import { PaginationDto } from 'src/common/dto/pagination.dto';

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
      this.handleError(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
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
      this.handleError(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();

    // const pokemon = await this.pokemonModel.findByIdAndDelete(id);
    // console.log(pokemon);

    const pokemon = await this.pokemonModel.deleteOne({ _id: id });
    console.log(pokemon);

    if (pokemon.deletedCount === 0) {
      throw new BadRequestException(`El pokemon con id -${id}- no existe`);
    }

    return;
  }

  private handleError(error: any) {
    console.log(error.message);
    if (error.code === 11000) {
      throw new BadRequestException(
        `Ya existe un ${JSON.stringify(error.keyValue)} en la BD`,
      );
    }
    throw new InternalServerErrorException('Error en el servidor');
  }
}
