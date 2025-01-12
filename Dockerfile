FROM node:20-bullseye AS builder

WORKDIR /usr/src/node-app

COPY package*.json yarn.lock ./

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

RUN yarn run build

FROM python:3.10-bullseye AS finetune

WORKDIR /finetune_model

COPY --from=builder /usr/src/node-app/src/finetune_model/requirements.txt . 

COPY --from=builder /usr/src/node-app/src/utils ./utils
COPY --from=builder /usr/src/node-app/src/finetune_model .

RUN apt-get update && apt-get install -y g++ gcc libffi-dev && \
    pip install --break-system-packages -r requirements.txt && python finetune.py

FROM node:20-bullseye

WORKDIR /usr/src/node-app

RUN apt-get update && apt-get install -y python3 python3-pip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
    
# Install python dependencies in node image
COPY --from=builder /usr/src/node-app/src/finetune_model/requirements.txt ./src/finetune_model/requirements.txt
RUN pip3 install  -r src/finetune_model/requirements.txt

COPY --from=builder /usr/src/node-app .
COPY --from=finetune /finetune_model/model_output ./src/finetune_model/model_output
COPY --from=finetune /finetune_model/data_regulation.csv ./src/finetune_model/data_regulation.csv

RUN yarn install --pure-lockfile

USER node

EXPOSE 3000

CMD ["yarn", "start"]