# Pull from a base image
FROM node:12-slim

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

# Set the user
USER node

# Set env variables
ENV NODE_ENV production

# Install dependencies (npm ci is similar to npm i, but for automated builds)
RUN npm install --production

COPY --chown=node:node . .

# Set Node server
ENTRYPOINT npm run start
