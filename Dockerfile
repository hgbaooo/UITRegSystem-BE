FROM node:20-alpine AS builder

WORKDIR /usr/src/node-app

COPY package*.json yarn.lock ./

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

RUN yarn run build

FROM python:3.10-slim-bookworm AS finetune

WORKDIR /finetune_model

COPY --from=builder /usr/src/node-app/src/finetune_model/requirements.txt . 

COPY --from=builder /usr/src/node-app/src/utils ./utils
COPY --from=builder /usr/src/node-app/src/finetune_model .

RUN pip install -r requirements.txt 

# Get python3 path
RUN which python3 > /tmp/python3_path.txt
RUN python finetune.py

FROM node:20-alpine

WORKDIR /usr/src/node-app

RUN apk add --no-cache python3

# Copy python executable from finetune stage
COPY --from=finetune /tmp/python3_path.txt /tmp/python3_path.txt
RUN PYTHON_PATH=$(cat /tmp/python3_path.txt) && cp "$PYTHON_PATH" /usr/bin/python3 && chmod +x /usr/bin/python3


COPY --from=builder /usr/src/node-app .
COPY --from=finetune /finetune_model/model_output ./src/finetune_model/model_output
COPY --from=finetune /finetune_model/data_regulation.csv ./src/finetune_model/data_regulation.csv

RUN yarn install --pure-lockfile

USER node

EXPOSE 3000

CMD ["yarn", "start"]