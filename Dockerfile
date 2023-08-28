FROM docker:dind

WORKDIR /app

RUN apk update && apk add nodejs npm

RUN wget https://get.pulumi.com/releases/sdk/pulumi-v3.78.1-linux-x64.tar.gz && \
  mkdir -p /tmp/pulumi && \
  tar zxf /app/pulumi-v3.78.1-linux-x64.tar.gz -C /tmp/pulumi && \
  mkdir -p /app/.pulumi/bin && \
  cp /tmp/pulumi/pulumi/* /app/.pulumi/bin/ 
ENV PATH=$PATH:/app/.pulumi/bin/ 

COPY . .

RUN npm ci
RUN npm run grpc:generate

CMD ["npm", "run", "dev"]
# CMD ["npm", "run", "start"]

# docker build . -t pulumi-in-docker
# docker run -it --privileged -p 50051:50051 -v /var/run/docker.sock:/var/run/docker.sock -v ./src:/app/src -v /home/ryan/Code/arcctl-build-modules/test/yaml:/home/ryan/Code/arcctl-build-modules/test/yaml pulumi-in-docker
