FROM node:18-alpine as app

# set env variable 
ENV PORT=8080
ENV HOST=0.0.0.0
ENV NODE=dev



WORKDIR /app

COPY package*.json ./
# RUN npm ci
RUN npm install --production
COPY . .

# RUN npm run build:${NODE}

# Expose the correct port(tell docker this container listens on port 8080)
EXPOSE 8080
CMD ["npm", "start"]
