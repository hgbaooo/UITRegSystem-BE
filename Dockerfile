# Stage 1: Build Node.js application
FROM node:20-bullseye AS builder

# Set the working directory in the container
WORKDIR /usr/src/node-app

# Install system dependencies required by sharp
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    libvips-dev 
    
# Copy package files and install dependencies
COPY package*.json yarn.lock ./
RUN yarn install --network-timeout 600000 --pure-lockfile

# Copy the rest of the application files
COPY --chown=node:node . .

# Build the Node.js application
RUN yarn run build

# Stage 2: Python environment for fine-tuning
FROM python:3.10-bullseye AS finetune

# Set the working directory in the container
WORKDIR /finetune_model

# Copy necessary files for fine-tuning
COPY --from=builder /usr/src/node-app/src/finetune_model/requirements.txt .
COPY --from=builder /usr/src/node-app/src/utils ./utils
COPY --from=builder /usr/src/node-app/src/finetune_model .
COPY --from=builder /usr/src/node-app/src/finetune_model/data_regulation.csv .

# Upgrade pip to the latest version
RUN pip install --upgrade pip

# Install dependencies for fine-tuning
RUN apt-get update && apt-get install -y --no-install-recommends g++ gcc libffi-dev libgl1-mesa-glx libopenblas-dev && \
    pip install --break-system-packages -r requirements.txt

# Run the fine-tuning script
RUN python finetune.py

# Stage 3: Final Node.js application
FROM node:20-bullseye

# Set the working directory in the container
WORKDIR /usr/src/node-app

# Install Python and related tools
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Upgrade pip to the latest version
RUN pip3 install --upgrade pip

# Copy updated Python dependencies and the fine-tuned model
COPY --from=builder /usr/src/node-app/src/finetune_model/requirements.txt ./src/finetune_model/requirements.txt
RUN pip3 install -r src/finetune_model/requirements.txt

# Copy application files and fine-tuned outputs
COPY --from=builder /usr/src/node-app .
COPY --from=finetune /finetune_model/model_output ./src/finetune_model/model_output
COPY --from=finetune /finetune_model/data_regulation.csv ./src/finetune_model/data_regulation.csv

# Install Node.js dependencies
RUN yarn install --pure-lockfile

# Set the container to use the "node" user
USER node

# Expose the application port
EXPOSE 3000

# Find python3 path
RUN which python3 > /tmp/python3_path

# Start the application
CMD ["yarn", "start"]