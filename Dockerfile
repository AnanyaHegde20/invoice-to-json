FROM node:20

ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-venv \
    python3-dev \
    build-essential \
    swig \
    poppler-utils \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    git \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy only required files first
COPY requirements.txt ./
COPY package*.json ./

# Create venv and install Python deps
RUN python3 -m venv /app/ocr_env \
    && /app/ocr_env/bin/pip install --upgrade pip \
    && /app/ocr_env/bin/pip install -r requirements.txt

# Install Node deps
RUN npm install

# Copy rest of code
COPY . .

# Set PATH
ENV PATH="/app/ocr_env/bin:$PATH"

# ✅ FIX: Create PaddleOCR folder + permissions
RUN mkdir -p /home/appuser/.paddleocr \
    && chmod -R 777 /home/appuser/.paddleocr

# Create non-root user
RUN useradd -ms /bin/bash appuser \
    && chown -R appuser:appuser /app /home/appuser

USER appuser

EXPOSE 5000

CMD ["npx", "ts-node", "src/server.ts"]