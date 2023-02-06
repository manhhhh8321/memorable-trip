import { Connection } from 'typeorm';
import { Seeder, Factory } from 'typeorm-seeding';
import { EncryptHelper } from 'src/helpers/encrypt.helper';
import { User } from 'src/modules/users/entities/user.entity';

import userData from './data/users.json';

export default class CreateEndUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // generate random users
    await factory(User)().createMany(100);

    const qb = connection.getRepository(User).createQueryBuilder();
    if (await qb.getOne()) {
      return;
    }
    const arr = await Promise.all(
      userData.map(async (item) => ({
        ...item,
        password: await EncryptHelper.hash(item.password),
      })),
    );
    await qb
      .insert()
      .values(arr as any)
      .execute();
  }
}
