import { define } from 'typeorm-seeding';
import faker from 'faker';
import { User } from 'src/modules/users/entities/user.entity';

define(User, () => {
  return new User({
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  });
});
