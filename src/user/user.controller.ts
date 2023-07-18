import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Query,
  Param,
  Delete,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    console.log('color');
    session.color = color;
  }

  @Get('/colors')
  getColor(@Session() session: any) {
    console.log(session.color);
    return session.color;
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user: User) {
    return user;
    // async me(@Session() session: any) {
    // const user = this.userService.findOne(session.userId);
    //
    // if (!user) {
    //   throw new UnauthorizedException('No user found');
    // }
    //
    // return user;
  }

  @Get('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;

    const user = await this.authService.signup(email, password);
    session.userId = user.id;

    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;

    const user = await this.authService.signin(email, password);
    session.userId = user.id;

    return user;
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const { email, password } = body;

    return this.userService.update(id, { email, password });
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    console.log('Handler is running');
    const user = await this.userService.findOne(id);

    console.log('This is user found: ');
    console.log(user);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    console.log('passed email: ');
    console.log(email);
    return this.userService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
