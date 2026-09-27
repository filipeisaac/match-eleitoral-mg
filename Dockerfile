FROM oven/bun:1-alpine
WORKDIR /app
COPY package.json server.ts ./
COPY src ./src
COPY public ./public
RUN bun build src/app.ts --outfile public/app.js --minify --target browser
ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "server.ts"]
