FROM node:14-alpine as builder

WORKDIR /

COPY package.json package-lock.json yarn.lock ./

RUN yarn install --ignore-scripts

ENV PATH=/node_modules/.bin:$PATH

CMD ["yarn", "start:prod"]
