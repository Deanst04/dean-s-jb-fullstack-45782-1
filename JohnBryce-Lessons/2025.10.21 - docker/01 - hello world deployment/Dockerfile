# i start by selecting an existing docker image (a set of docker layers that were)
FROM node:22-alpine

# i create folder named /app in the root of the file system
WORKDIR /app

# i copy the app.js from the neighborhood of the Dockerfile to the docker image
COPY app.js ./

# lastly, when all is ready i run the program
CMD [ "node", "/app/app.js" ]