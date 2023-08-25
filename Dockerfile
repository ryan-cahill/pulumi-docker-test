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

# TODO: update to exclude dev
CMD ["npm", "run", "dev"]
