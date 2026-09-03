import { Match } from '@/decorators/match.decorator';
import { IsString, IsEmail, IsInt, Min, Max, IsOptional, MaxLength, MinLength, IsNotEmpty, ValidateIf } from 'class-validator';



export class CreateUserDto 
{
  @IsString()
  category!: string;

  @IsString()
  @MinLength(3, { message: 'Firstname can only have a minimum of 3 character' })
  @MaxLength(20, { message: 'Firstname too long, (Maximum of 20 character)' })
  firstname!: string;

  @IsString()
  @MinLength(3, { message: 'Surname can only have a minimum of 3 character' })
  @MaxLength(20, { message: 'Surame too long, (Maximum of 20 character)' })
  surname!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email!: string;
  
  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword!: string;
  
}
