import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UnauthorizedDto } from 'src/auth/dto/unauthorizedDto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './dto/userDto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/createUserDto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtGuard)
  @ApiOkResponse({
    description: 'Return user data',
    type: User,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
  })
  @Get('profile')
  async getProfile(@Headers('authorization') token: string) {
    const verified = await this.userService.verifyToken(token.split(' ')[1]);

    return this.userService.findOneForRegister({
      where: { username: verified.username },
    });
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
