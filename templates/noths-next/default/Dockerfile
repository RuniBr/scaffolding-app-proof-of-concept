FROM hub.noths.com/node:10-alpine AS base

# Configure directory
WORKDIR /service
ADD . /service

# Install dependencies
RUN apk update && apk add git && \
  apk add --no-cache make gcc g++ python

# Install node dependencies
RUN npm ci

# Build application
RUN npm run build

FROM hub.noths.com/node:10-alpine

# Configure directory, allowed user and port
WORKDIR /service
EXPOSE 8080

# Copy only necessary files
COPY --from=base --chown=user ["/service/node_modules", "./node_modules"]
COPY --from=base --chown=user ["/service/build", "./build"]
COPY --from=base --chown=user ["/service/public", "./build/public"]
COPY --from=base --chown=user ["/service/package.json", "./package.json"]
COPY --from=base --chown=user ["/service/next.config.js", "./next.config.js"]
COPY --from=base --chown=user ["/service/server", "./server"]
COPY --from=base --chown=user ["/service/pages", "./pages"]

# Expose git commit hash for runtime (next.js will pass its config in the server rendered template onto the client)
ARG GIT_COMMIT
ENV GIT_COMMIT=$GIT_COMMIT

# Start application
