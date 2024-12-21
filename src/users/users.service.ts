import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/createUserDto';
import { PrismaService } from 'src/prisma.service';
// @ts-ignore
import { Prisma, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async findOne(login: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { OR: [{ phone: login }, { email: login }] },
    });
  }

  async findOneForRegister(
    // @ts-ignore
    props: Prisma.UserFindFirstArgs,
  ): Promise<Partial<User> | null> {
    const user = await this.prisma.user.findFirst(props);
    if (!user) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...responseUser } = user;
    return responseUser;
  }

  async create(user: CreateUserDto): Promise<{
    access_token: string;
    refresh_token: string;
    user: Partial<User>;
  }> {
    const createdUser = await this.prisma.user.create({
      data: { ...user, balance: { lightCoins: 0, main: 0 } },
    });
    const payload = { sub: createdUser.id, username: createdUser.username };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...responseUser } = createdUser;

    return {
      user: responseUser,
      access_token: this.jwtService.sign(payload, { expiresIn: '1d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.jwt_secret,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Token has been expired');
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }
}
