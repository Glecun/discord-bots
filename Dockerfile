FROM arm32v7/node:18-alpine

ENV NPM_CONFIG_LOGLEVEL warn

ARG PHRASE_IMPORTANTE_BOT_TOKEN_ARG
ENV PHRASE_IMPORTANTE_BOT_TOKEN=$PHRASE_IMPORTANTE_BOT_TOKEN_ARG

ARG GREETING_BOT_TOKEN_ARG
ENV GREETING_BOT_TOKEN=$GREETING_BOT_TOKEN_ARG

ARG B4_BAMBOU_GENERAL_CHANNEL_KEY_ARG
ENV B4_BAMBOU_GENERAL_CHANNEL_KEY=$B4_BAMBOU_GENERAL_CHANNEL_KEY_ARG

# Copy all local files into the image.
COPY . .

RUN apk add --no-cache python3 py3-pip

RUN rm package-lock.json
RUN npm install
RUN npm run start-raspberry