import { Role } from 'src/common/enums/role.enum';

export interface Payload {
  id: number;
  email: string;
  name: string;
  role: Role;
}
