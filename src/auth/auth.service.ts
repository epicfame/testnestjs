import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity'; // Import your User entity
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>, // Inject User repository
  ) {}

  async register(userDto: UserDto): Promise<User> {
    // Check if the name already exists
    // const existingUser = await this.userRepository.findOne({ name: userDto.name });
    const existingUser = await this.userRepository.findOne({
      where: { name: userDto.name },
    });
    if (existingUser) {
      throw new Error('name already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    // Create and save the user
    const newUser = this.userRepository.create({ ...userDto, password: hashedPassword });
    return await this.userRepository.save(newUser);
  }

  // async validateUser(name: string, password: string): Promise<any> {
  //   // const user = await this.userRepository.findOne(name);
  //   const user = await this.userRepository.findOne({
  //     where: { name },
  //   });
  //   // const user = await this.userRepository.find({where: {name}})
  //   // const user = await this.userRepository.find()
  //   // console.log(user, "validate user")
  //   if (user && (await bcrypt.compare(password, user.password))) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result; // Return user without password
    }
    return null; // Return null if user not found or password doesn't match
  }

//   async validateUser(name: string, password: string): Promise<any> {
//   console.log('Searching for user with name:', name); // Debug log to see the input name

//   // Correct usage of findOne to search for a single user by name
//   const user = await this.userRepository.findOne({
//     where: { name }, // Check for a match on name
//   });

//   console.log('User found:', user); // Log the result of the user search

//   if (user) {
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     console.log('Password Match:', passwordMatch); // Log if password matches

//     if (passwordMatch) {
//       const { password, ...result } = user; // Exclude password from the result
//       return result; // Return user data without password
//     }
//   }
  
//   return null; // Return null if user not found or password does not match
// }


  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    console.log(payload, 'this is payload')
    // const token = "TOKEN IS TOKEN LA HEEHHE";
    const token = this.jwtService.sign(payload)
    console.log('Generated JWT:', token)
    return {
      email: user.email,
      access_token: token,
    };
  }


}
