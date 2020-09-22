FROM node:10-alpine

#Maintainer
LABEl maintainer="Fola Oyewole <foyewole@telnetng.com>"

RUN mkdir -p /src/app

WORKDIR /src/app

COPY package*.json /src/app/

RUN npm install

COPY . /src/app

ENV FMDAPORT=3033

ENV BASE_URL=http://104.192.6.17:9091

CMD [ "npm", "start" ]
