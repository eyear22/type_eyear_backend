import { UploadedFile } from '@nestjs/common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import {IsFile, MemoryStoredFile} from 'nestjs-form-data'

export class CreatePostDto {
    @ApiProperty({ description: '비디오 파일, 백엔드에서는 Express.Multer.File인데 File 형식으로 시도해보기' })
    video: Express.Multer.File;

    @IsNumberString()
    @ApiProperty({ description: '엽서 스탬프 선택 인덱스' })
    stampNumber: number;

    @IsNumberString()
    @ApiProperty({ description: '엽서 카드 선택 인덱스' })
    cardNumber: number;

    @IsNumberString()
    @ApiProperty({ description: '보낸이 개인 id' })
    user: number;
}
