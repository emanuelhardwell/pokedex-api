import { IsInt, IsNumber, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsPositive({ message: 'el límite debe ser un número positivo' })
  @IsInt({ message: 'el límite debe ser un número entero' })
  @Min(1, { message: 'límite no debe ser inferior a 1' })
  limit?: number;

  @IsNumber()
  @IsPositive({ message: 'el desplazamiento debe ser un número positivo' })
  @IsInt({ message: 'el desplazamiento debe ser un número entero' })
  offset?: number;
}
