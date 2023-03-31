FROM node:14-alpine 

WORKDIR /

ENV PATH=/app/node_modules/.bin:$PATH

COPY package.json yarn.lock ./

RUN yarn install --network-concurrency 1

COPY . .

EXPOSE 3001

RUN yarn build

CMD ["yarn", "start:prod"]
