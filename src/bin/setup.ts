import path from 'path';
import fs from 'fs';

import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';
import chalk from 'chalk';
import { ConnectionOptions } from 'typeorm';

const log = console.log;

const todoList = {
  createORMFile: {
    task: 'Create ormconfig.json',
    status: true,
  },
};

const ROOT_DIR = path.resolve(__dirname, '..', '..');

// load args
// sample : https://www.npmjs.com/package/command-line-args
const optionDefinitions: commandLineArgs.OptionDefinition[] = [
  { name: 'force', alias: 'f', type: Boolean, defaultValue: false },
  { name: 'development', alias: 'd', type: Boolean, defaultValue: true },
  { name: 'production', alias: 'p', type: Boolean, defaultValue: false },
];
const options = commandLineArgs(optionDefinitions) as {
  force: boolean;
  development: boolean;
  production: boolean;
};

// load env
if (options.production) {
  dotenv.config({
    path: `${ROOT_DIR}/.env.prod`,
  });
} else if (options.development) {
  dotenv.config({
    path: `${ROOT_DIR}/.env`,
  });
}

// Check typeORM documentation for more information.
const ormconfig: ConnectionOptions & {
  seeds: string[];
  factories: string[];
} = {
  type: process.env.DATABASE_TYPE as any,
  host: process.env.DATABASE_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: false,
  logging: true,
  logger: 'advanced-console',
  entities: ['src/**/*.entity.{ts,js}'],
  migrations: ['src/db/migrations/**/*.{ts,js}'],
  cli: {
    entitiesDir: 'src/modules/**/entities',
    migrationsDir: 'src/db/migrations',
  },
  seeds: ['src/db/seeding/seeds/**/*.{ts,js}'],
  factories: ['src/db/seeding/factories/**/*.{ts,js}'],
};

log(chalk.blue('STARTING SETUP'));
log('---------------------');

// write file
const ormconfigFile = `${ROOT_DIR}/ormconfig.json`;
if (fs.existsSync(ormconfigFile) && !options.force) {
  log(chalk.yellow(`The ormconfigfile has been existed ${ormconfigFile}`));
} else {
  try {
    fs.writeFileSync(ormconfigFile, JSON.stringify(ormconfig, null, 2));
    fs.chmodSync(ormconfigFile, 0o600);
    log(chalk.green(`Created new file ${ormconfigFile}`));
    fs.closeSync(2);
  } catch (error) {
    log(chalk.red(error));
    todoList.createORMFile.status = false;
  }
}

// statuses

Object.keys(todoList).map((k, idx) => {
  log(`${idx + 1}. ${todoList[k].task} - ${todoList[k].status ? chalk.green('success') : chalk.red('failed')}`);
});

log('---------------------');
log(chalk.blue('END SETUP'));
