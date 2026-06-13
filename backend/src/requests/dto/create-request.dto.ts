import { IsNumber, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsString()
  issue!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;
}