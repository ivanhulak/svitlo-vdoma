# # Stage 1: Build Python Environment with Selenium
# FROM python:3.9-slim as python-builder

# # Set working directory
# WORKDIR /usr/src/app

# # Install necessary dependencies for Python (Selenium, Chrome, Chromedriver)
# RUN apt-get update && apt-get install -y \
#     wget \
#     curl \
#     unzip \
#     ca-certificates \
#     gnupg \
#     libgdk-pixbuf2.0-0 \
#     libnss3 \
#     libx11-dev \
#     libxcomposite-dev \
#     libxrandr-dev \
#     libxss1 \
#     libappindicator3-1 \
#     libatk-bridge2.0-0 \
#     libatk1.0-0 \
#     libgbm-dev \
#     libasound2 \
#     libgconf-2-4 \
#     python3-venv \
#     && rm -rf /var/lib/apt/lists/*

# # Create a virtual environment
# RUN python3 -m venv /usr/src/app/venv

# # Copy the requirements.txt file to the working directory
# COPY ./requirements.txt /usr/src/app/requirements.txt

# # Activate the virtual environment and install dependencies
# RUN /usr/src/app/venv/bin/pip install --no-cache-dir -r requirements.txt

# # Install selenium
# RUN /usr/src/app/venv/bin/pip install selenium

# Stage 2: Build and Setup Node.js Environment
FROM node:18.20.2

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install Python and pip in the final stage
# RUN apt-get update && apt-get install -y python3 python3-venv 

# Copy the virtual environment from the python-builder stage
# COPY --from=python-builder /usr/src/app/venv /usr/src/app/venv

# Set environment variables to use the virtual environment's Python and pip
# ENV PATH="/usr/src/app/venv/bin:$PATH"

# Copy package.json, yarn.lock, and prisma directory
COPY package*.json ./
COPY yarn.lock ./
COPY prisma /usr/src/app/prisma/

# Install Node.js dependencies
RUN yarn install


# Copy the rest of the application code to the working directory
COPY . .
# COPY ./requirements.txt /usr/src/app/requirements.txt

# Build the NestJS application
RUN yarn build

# Expose the application port
EXPOSE 8000

# Start the NestJS application
CMD ["yarn", "start"]
