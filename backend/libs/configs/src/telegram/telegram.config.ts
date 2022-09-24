import { MyBotTelegramOptions } from '@app/interfaces/telegram/telegram.interface';
import { ConfigService } from '@nestjs/config';

export const getTelegramConfig = (
  configService: ConfigService,
): MyBotTelegramOptions => {
  const token = configService.get('TELEGRAM_BOT_TOKEN');

  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN - не задан');
  }

  return {
    token,
    chatId: configService.get('TELEGRAM_CHAT_ID') ?? '',
  };
};
