import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const users = await this.userService.find(email);

    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    // Hash users password
    /// 1. generate salt
    const salt = randomBytes(8).toString('hex');

    // 2. create hash
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // 3. join the salt and password together
    const result = `${salt}.${hash.toString('hex')}`;

    // create new user and save it

    const user = await this.userService.create(email, result);
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }

    return user;
  }
}
