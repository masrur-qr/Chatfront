FROM node

WORKDIR /app

COPY package.json ./

COPY package-lock.json ./

RUN npm install npm@8.5.1 --location=global
RUN npm install -g npm@9.7.1 

# RUN npm install --frozen-lockfile

COPY . .

EXPOSE 3000

# CMD ["server", "-s", "build"]
CMD [ "npx", "serve", "-s","build" ]