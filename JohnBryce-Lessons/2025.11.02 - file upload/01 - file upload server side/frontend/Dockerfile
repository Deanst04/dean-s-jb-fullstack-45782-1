# start with base image, linux + node
FROM node:22-alpine

# create a folder for the app on the target OS
WORKDIR /app

# copy package.json && package-lock.json
COPY ./package*.json ./

# install all dependencies
RUN npm install

# copy everything except whatever is in .dockerignore
COPY ./ ./

# what runs when the image is loaded by docker into a container
CMD [ "npm", "run", "docker" ]

# docker run --name weezer-backend -d -p 3010:3000 -e NODE_ENV=docker deanst/weezer-backend:3.0.0