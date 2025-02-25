import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class FindAllPetsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

export { FindAllPetsDto };
