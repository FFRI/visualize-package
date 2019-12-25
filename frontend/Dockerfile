FROM node:11
ARG NPM_DEVS_VISUALIZER_CLIENT_ID
ARG NPM_DEVS_VISUALIZER_REDIRECT_URL
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "serve", "--", "-p", "1234"]
