import { AuthService } from './auth.service';
import { Public } from './auth.utils';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SignUpUserDto, LoginUserDto, ErrorResponseDto } from './dto';
import { AuthSuccessObject } from './auth.types';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthSuccessObject,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiBody({ type: LoginUserDto })
  async login(@Body() userSignInDTO: LoginUserDto) {
    return this.authService.login(userSignInDTO.email, userSignInDTO.password);
  }

  @Public()
  @Post('signUp')
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthSuccessObject,
  })
  @ApiConflictResponse({
    description: 'User with this email already exists',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiBody({ type: SignUpUserDto })
  signUp(@Body() userSignUpDto: SignUpUserDto) {
    return this.authService.signUp({ ...userSignUpDto });
  }

  // @Post('logout')
  // @ApiOperation({ summary: 'User logout' })
  // @ApiResponse({ status: 200, description: 'Logout successful' })
  // logout(@CurrentUser() user: TJWTUser) {
  //   return this.authService.logout(user.sub);
  // }

  @Public()
  @Get('refresh/:refreshToken')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
    type: AuthSuccessObject,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid refresh token',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  refreshTokens(@Param('refreshToken') refreshToken: string) {
    return this.authService.getNewTokensFromRefreshToken(refreshToken);
  }
}
