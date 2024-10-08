FROM node:20

RUN mkdir /usr/app
WORKDIR /usr/app

COPY yarn.lock .
COPY package.json .

RUN yarn install
COPY . .
EXPOSE 8000
CMD ["yarn", "start"]
