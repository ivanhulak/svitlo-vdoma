import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/createUserDto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { RegisterResponseDto } from './dto/RegisterResponseDto';
import { LoginDto } from './dto/loginDto';
import { SignInDto } from './dto/signInDto';
import { TokenDto } from './dto/tokenDto';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import { Request, Response } from 'express';
import { GoogleOauthGuard } from './guards/google-auth/google-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}
  saltOrRounds: number = 10;

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOkResponse({
    description: 'Login user',
    type: LoginDto,
  })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.findOne(signInDto.login);
    const isMatch = await bcrypt.compare(
      signInDto.password,
      user?.password ?? '',
    );
    if (!user || !isMatch) {
      throw new HttpException(
        { message: 'Wrong credentials' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const { refresh_token, ...response } = await this.authService.login(user);

    this.authService.addRefreshTokenToResponse(res, refresh_token);

    return response;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Register user',
    type: RegisterResponseDto,
  })
  @Post('register')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.findOneForRegister({
      where: {
        OR: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      },
    });

    if (user) {
      throw new HttpException(
        { message: 'User with that username or email already exist' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const hashPass = await bcrypt.hash(
      createUserDto.password,
      this.saltOrRounds,
    );

    const { refresh_token, ...response } = await this.userService.create({
      ...createUserDto,
      password: hashPass,
    });

    this.authService.addRefreshTokenToResponse(res, refresh_token);

    return response;
  }

  @UseGuards(RefreshJwtGuard)
  @ApiOkResponse({
    description: 'Refresh token',
    type: TokenDto,
  })
  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies[this.authService.REFRESH_TOKEN_NAME];

    if (!token) {
      this.authService.removeRefreshTokenFromResponse(res);
      throw new UnauthorizedException('Refresh token not passed');
    }
    return this.authService.refreshToken(token);
  }

  @ApiOkResponse({
    description: 'Logout',
    type: Boolean,
  })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.authService.removeRefreshTokenFromResponse(res);
    return true;
  }

  @ApiOkResponse({
    description: 'Google auth',
    type: Boolean,
  })
  @HttpCode(HttpStatus.OK)
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {}

  @ApiOkResponse({
    description: 'Google',
    type: Boolean,
  })
  @HttpCode(HttpStatus.OK)
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  @Redirect()
  async googleAuthReturn(@Req() req: Request & { user: CreateUserDto }) {
    await this.authService.handleGoogleAuth(req.user);
    return { url: 'http://localhost:9000/' };
  }

  @ApiOkResponse({
    description: 'forgot password',
    type: Object,
  })
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() { email }: { email: string }): Promise<void> {
    return this.authService.forgotPassword(email);
  }
}
