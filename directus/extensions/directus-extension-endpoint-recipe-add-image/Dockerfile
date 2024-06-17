# pull base image
FROM node:20.10.0-bullseye-slim

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default to port 19006 for node, and 19001 and 19002 (tests) for debug
ARG PORT=19006
ENV PORT $PORT
EXPOSE 19006 19001 19002

# install global packages
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH /home/node/.npm-global/bin:$PATH
RUN npm i --g yarn

# install dependencies first, in a different location for easier app bind mounting for local development
# due to default /opt permissions we have to create the dir with root and change perms
RUN mkdir /opt/directus_extension
WORKDIR /opt/directus_extension
ENV PATH /opt/directus_extension/.bin:$PATH
COPY package.json yarn.lock ./

# copy in our source code last, as it changes the most
WORKDIR /opt/directus_extension
# for development, we bind mount volumes; comment out for production
COPY . .