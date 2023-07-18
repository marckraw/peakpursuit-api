import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(email: string, password: string) {
    const user = this.userRepository.create({ email, password });

    return this.userRepository.save(user);
  }

  findOne(id: string) {
    if (!id) {
      return null;
    }

    return this.userRepository.findOneBy({ id }); // returns single result matching criteria
  }

  find(email: string) {
    return this.userRepository.find({ where: { email } }); // returns array of result matching criteria
  }

  findAll() {
    return this.userRepository.find();
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const newUser = { ...user, ...attrs };

    return this.userRepository.save(newUser);
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    console.log('This is user');
    console.log(user);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return await this.userRepository.remove(user);
  }
}
