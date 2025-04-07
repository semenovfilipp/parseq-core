#!/bin/bash

# Переход в директорию скрипта
ROOT=$(dirname "$0")
cd "$ROOT"

# Укажите Docker репозиторий и токен
DOCKER_USERNAME="your_name"
DOCKER_TOKEN="your_token"

# Логин в Docker Hub
echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

# Сборка фронтенд проекта
echo "Building frontend project..."
npm install || exit 1
npm run build || exit 1

# Определяем имя образа и тега
BUILD_BRANCH=$(git rev-parse --abbrev-ref HEAD)
BRANCH_NAME_LOWER=$(echo "$BUILD_BRANCH" | tr '[:upper:]' '[:lower:]')

IMAGE=$DOCKER_USERNAME/your_frontend:$BRANCH_NAME_LOWER

# Используем Buildkit для сборки фронтенд образа
DOCKER_BUILDKIT=1 docker build . -t "$IMAGE"

# Пушим образ в Docker Hub
docker push "$IMAGE"

echo --------------------------------------------------
echo Docker image: $IMAGE
echo --------------------------------------------------