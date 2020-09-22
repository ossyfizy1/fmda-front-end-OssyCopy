FROM node:10-alpine

#Maintainer
LABEl maintainer="Fisayo Omotayo <fomotayo@telnetng.com>"

RUN mkdir -p /src/app

WORKDIR /src/app

COPY package*.json /src/app/

RUN npm install

COPY . /src/app

ENV FMDAPORT=3033
ENV TYPE=LIVE

ENV BASE_URL=http://136.243.242.133:9090

CMD [ "npm", "start" ]
