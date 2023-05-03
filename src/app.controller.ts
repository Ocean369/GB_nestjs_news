import { Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('home')
  async home() {
    return {}
  }

  @Get('signin')
  @Render('sign-in')
  async signIn() {
    return {}
  }

  @Get('signup')
  @Render('registration')
  async signUp() {
    return {}
  }

}
