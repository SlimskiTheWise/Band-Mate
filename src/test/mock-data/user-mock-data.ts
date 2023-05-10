import { Role } from 'src/common/enums/role.enum';
import { Users } from 'src/users/users.entity';

export function seedSingleUser(): Users {
  const user = new Users();
  user.id = 1;
  user.name = 'random-name';
  user.email = 'test@test.com';
  user.password = '123456';
  user.createdAt = new Date();
  user.updatedAt = new Date();
  user.deletedAt = null;
  user.role = Role.USER;
  return user;
}
