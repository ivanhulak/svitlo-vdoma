import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// @ts-ignore
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { MailService } from 'src/mail/mail.service';
import { CreateUserDto } from 'src/users/dto/createUserDto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  REFRESH_TOKEN_NAME = 'refreshToken';
  EXPIRE_DAY_REFRESH_TOKEN = 1;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async login(
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { sub: user.id, username: user.username };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...responseUser } = user;
    return {
      ...responseUser,
      access_token: this.jwtService.sign(payload, { expiresIn: '1d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    const compareResult = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (user && compareResult) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: userPass, ...result } = user;
      return result;
    }
    return null;
  }

  async refreshToken(refreshToken: string): Promise<{
    access_token: string;
    refresh_token: string;
    user: User | null;
  }> {
    const result = await this.jwtService.verifyAsync(refreshToken);
    if (!result) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.usersService.findOne(result.username);
    const payload = { sub: user?.id, username: user?.username };
    return {
      user,
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  addRefreshTokenToResponse(res: Response, responseToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, responseToken, {
      httpOnly: true,
      domain: 'localhost',
      expires: expiresIn,
      secure: true,
      sameSite: 'none',
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: 'localhost',
      expires: new Date(),
      secure: true,
      sameSite: 'none',
    });
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.usersService.findOne(googleUser.email);
    if (user) return true;
    return this.usersService.create(googleUser);
  }
  async handleGoogleAuth(user: CreateUserDto): Promise<string> {
    const existingUser = await this.usersService.findOne(user.email ?? '');

    if (existingUser) {
      const { access_token } = await this.login(existingUser);
      return access_token;
    } else {
      const { access_token } = await this.usersService.create({
        username: user.username,
        email: user.email ?? '',
        // @ts-ignore
        isOAuthRegister: true,
        // @ts-ignore
        image: user.avatar,
      });
      return access_token;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOneForRegister({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    try {
      const token = this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '1h' },
      );
      await this.usersService.updateUser(user.id ?? '', {
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 3600000),
      });

      await this.mailService.sendMail({
        to: email,
        subject: 'Password Reset Request',
        text: `Reset your password using this link: ${process.env.FRONTEND_URL}/reset-password?token=${token}`,
      });
    } catch (err) {
      console.log('error', err);
      throw new InternalServerErrorException('Email could not be sended');
    }
  }
}
