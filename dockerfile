FROM node:18.12.0-alpine
WORKDIR /maps
ENV PATH="./node_modules/.bin:$PATH"
COPY  . .
RUN npm run build
EXPOSE 3000
CMD [ "npm","start" ]