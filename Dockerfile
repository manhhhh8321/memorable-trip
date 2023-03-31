FROM node:14-alpine 

WORKDIR /

ENV PATH=/app/node_modules/.bin:$PATH

COPY package.json package-lock.json yarn.lock ./

RUN yarn install --ignore-scripts

COPY . .

EXPOSE 3001

RUN yarn build

CMD ["yarn", "start:prod"]