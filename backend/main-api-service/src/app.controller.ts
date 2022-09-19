import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { JwtAuthGuard } from "./auth/guards/jwt.guard";
import { Role } from "./user/user.model";
import { Roles } from "./auth/decorators/roles.decorator";
import { RolesGuard } from "./auth/guards/roles.guard";
import { UserService } from "./user/user.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getHello() {
    const user = await this.userService.findUserByEmail("test1@mail.ru");
    return user;
  }

  @Post("micro-event")
  testMicroEvent(@Body() numbers: number[]) {
    this.appService.countNumberEvent(numbers);
  }

  @Post("micro-message")
  testMicroMessage(@Body() numbers: number[]) {
    return this.appService.countNumberMessage(numbers);
  }
}
