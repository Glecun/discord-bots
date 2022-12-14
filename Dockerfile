FROM arm32v7/node:16-alpine

ENV NPM_CONFIG_LOGLEVEL warn

#Timezone
RUN apk add --no-cache tzdata
ENV TZ=Europe/Paris

# Set the default command to run when a container starts
CMD ["npm", "run", "start-prod"]

# Install app dependencies
COPY package.json  .
RUN apk --no-cache add build-base
RUN apk add --no-cache python3 py3-pip
RUN npm install --verbose

#Environment variables
ARG PHRASE_IMPORTANTE_BOT_TOKEN_ARG
ENV PHRASE_IMPORTANTE_BOT_TOKEN=$PHRASE_IMPORTANTE_BOT_TOKEN_ARG

ARG GREETING_BOT_TOKEN_ARG
ENV GREETING_BOT_TOKEN=$GREETING_BOT_TOKEN_ARG

ARG B4_BAMBOU_GENERAL_CHANNEL_KEY_ARG
ENV B4_BAMBOU_GENERAL_CHANNEL_KEY=$B4_BAMBOU_GENERAL_CHANNEL_KEY_ARG

# Copy all local files into the image.
COPY . .

# Compile typescript
RUN npm run tsc
