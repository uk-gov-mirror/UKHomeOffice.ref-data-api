FROM node:10-alpine

ENV USERMAP_UID 1000
ENV PORT 5001

RUN apk update && apk upgrade

RUN mkdir -p /src
WORKDIR /src

COPY app /src/app
COPY test /src/test
COPY package* /src/
COPY .eslint* /src/

RUN npm ci

EXPOSE ${PORT}

USER ${USERMAP_UID}

HEALTHCHECK --interval=10s --timeout=2s --start-period=15s CMD node healthcheck.js
CMD ["npm","start"]
