import { EventEmitter } from 'events';

import { classToPlain } from 'class-transformer';
import { IPaginationMeta, IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import {
  DeepPartial,
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';

import { BaseModel } from './base.entity';

export class BaseRepository<Model extends BaseModel> extends EventEmitter {
  constructor(protected readonly model: Repository<Model>) {
    super();
    this.model = model;
  }

  async create(entity: DeepPartial<Model>): Promise<Model> {
    return classToPlain(await this.model.save(entity)) as any;
  }

  async createMultipleEntities(entities?: DeepPartial<Model>[]): Promise<Array<Model>> {
    return classToPlain(await this.model.save(entities)) as any;
  }

  async findById(id: string, opts?: FindOneOptions<Model>): Promise<Model> {
    return classToPlain(await this.findOne({ where: { id }, ...opts })) as any;
  }

  async findOne(entity: FindOneOptions<Model>): Promise<Model> {
    return this.model.findOne(entity);
  }

  async findByIds(ids: any[], options?: FindManyOptions<Model>): Promise<Model[]> {
    return classToPlain(await this.model.findByIds(ids, options)) as any;
  }

  async findAndCount(options?: FindManyOptions<Model>): Promise<[Model[], number]> {
    const [items, count] = await this.model.findAndCount(options);
    return [classToPlain(items) as any, count];
  }

  async find(options?: FindManyOptions<Model>): Promise<Model[]> {
    return classToPlain(await this.model.find(options)) as any;
  }

  async updateItem(entity: DeepPartial<Model>): Promise<Model> {
    return classToPlain(await this.model.save(entity)) as any;
  }

  async removeItem(
    criteria: string | string[] | number | number[] | Date | Date[] | FindConditions<Model>,
  ): Promise<DeleteResult> {
    return this.model.delete(criteria);
  }

  async softDeleteItem(entity: FindConditions<Model>): Promise<UpdateResult> {
    return this.model.softDelete(entity);
  }

  async paginationRepository(
    repository: Repository<Model>,
    options: IPaginationOptions,
    searchOptions?: FindConditions<Model> | FindManyOptions<Model>,
  ): Promise<Pagination<Model, IPaginationMeta>> {
    const pgResult = await paginate(repository, options, searchOptions);
    return {
      ...pgResult,
      items: classToPlain(pgResult.items) as any,
    };
  }

  async paginationQueryBuilder(
    queryBuilder: SelectQueryBuilder<Model>,
    options: IPaginationOptions,
  ): Promise<Pagination<Model, IPaginationMeta>> {
    const pgResult = await paginate(queryBuilder, options);
    return {
      ...pgResult,
      items: classToPlain(pgResult.items) as any,
    };
  }

  getModel(): Repository<Model> {
    return this.model;
  }
}
