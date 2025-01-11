FROM node:18-alpine AS builder

WORKDIR /app

#Copy nodejs config file
COPY package*.json yarn.lock ./

RUN yarn install --pure-lockfile

COPY . ./

RUN npm run build

FROM python:3.11-slim-bullseye AS finetune

WORKDIR /finetune_model

# Copy requirements và data
COPY --from=builder /app/src/finetune_model/requirements.txt .
COPY --from=builder /app/src/utils ./utils
COPY --from=builder /app/src/finetune_model/data_regulation.csv .

COPY --from=builder /app/src/finetune_model/finetune.py .
#Cài đặt và tạo model
RUN pip install -r requirements.txt
RUN python finetune.py

FROM node:18-alpine

WORKDIR /usr/src/node-app

#Copy nodejs source, model, python script, data csv
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=finetune /finetune_model/model_output ./src/finetune_model/model_output
COPY --from=finetune /finetune_model/qa_service_helper.py ./src/services/qa_service_helper.py
COPY --from=finetune /finetune_model/data_regulation.csv ./src/finetune_model/data_regulation.csv


#install dependencies
RUN apk add python3 && pip install --upgrade pip && ln -s /usr/bin/python3 /usr/bin/python && yarn install --pure-lockfile

USER node

EXPOSE 3000

CMD ["yarn", "start"]