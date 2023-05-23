import { Role } from 'src/common/enums/role.enum';
import { Users } from 'src/users/users.entity';

export function seedSingleUser(index = 1): Users {
  const user = new Users();
  user.id = index;
  user.name = `random-name${index}`;
  user.email = `test@test${index}.com`;
  user.password = '123456';
  user.createdAt = new Date();
  user.updatedAt = new Date();
  user.deletedAt = null;
  user.role = Role.USER;
  return user;
}

export function seedManyUsers(): Users[] {
  return Array.from({ length: 50 }, (_, i) => seedSingleUser(i));
}
