FROM node:14.17.3

WORKDIR /

ENV PATH=/node_modules/.bin:$PATH

COPY package.json package-lock.json yarn.lock ./

RUN yarn install 

COPY . .

EXPOSE 3000

RUN yarn build

ENV PATH=/node_modules/.bin:$PATH

CMD ["yarn", "start"]

