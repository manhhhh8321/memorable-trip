import { define } from 'typeorm-seeding';
import faker from 'faker';
import { User } from 'src/entities/index';

define(User, () => {
  return new User({
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    phone: faker.internet.phone().toLowerCase(),
    firstName: faker.name().toLowerCase(),
  });
});
