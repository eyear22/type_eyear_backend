import { ReqUserDto } from 'src/user/dto/req-user.dto';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface User extends ReqUserDto {}
  }
}
