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

RUN pip install --break-system-packages -r requirements.txt && python finetune.py

FROM node:20-alpine

WORKDIR /usr/src/node-app

RUN apk add --no-cache python3 py3-pip
# Install pip
#RUN apk add --no-cache py3-pip
# Install required python packages in node image
COPY --from=builder /usr/src/node-app/src/finetune_model/requirements.txt ./src/finetune_model/requirements.txt
RUN sed -i '/torch/d' ./src/finetune_model/requirements.txt && \
    pip3 install --break-system-packages -r src/finetune_model/requirements.txt && \
    pip3 install --break-system-packages torch==2.2.0+cpu torchvision==0.17.0+cpu torchaudio==2.2.0+cpu -f https://download.pytorch.org/whl/cpu/torch_stable.html


COPY --from=builder /usr/src/node-app .
COPY --from=finetune /finetune_model/model_output ./src/finetune_model/model_output
COPY --from=finetune /finetune_model/data_regulation.csv ./src/finetune_model/data_regulation.csv

RUN yarn install --pure-lockfile

USER node

EXPOSE 3000

CMD ["yarn", "start"]