import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description:
      '비디오 파일, 백엔드에서는 Express.Multer.File인데 File 형식으로 시도해보기',
  })
  video: Express.Multer.File;

  @IsNumberString()
  @ApiProperty({ description: '엽서 스탬프 선택 인덱스' })
  stampNumber: number;

  @IsNumberString()
  @ApiProperty({ description: '엽서 카드 선택 인덱스' })
  cardNumber: number;
}
