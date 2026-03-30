FROM dockerproxy.repos.tech.orange/node:alpine

WORKDIR /

RUN mkdir -p /webapp
COPY ../.output /webapp/.output

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD ["node", "/webapp/.output/server/index.mjs"]