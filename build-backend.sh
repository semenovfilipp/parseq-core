#!/bin/bash

ROOT=$(dirname $0)

# Укажите Docker репозиторий и токен
DOCKER_USERNAME="your_login"
DOCKER_TOKEN="your_token"

# Логин в Docker Hub
echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

echo "Building project..."
gradle clean build || exit 1

BUILD_BRANCH=$(git rev-parse --abbrev-ref HEAD)
BRANCH_NAME_LOWER=$(echo "$BUILD_BRANCH" | tr '[:upper:]' '[:lower:]')

IMAGE=$DOCKER_USERNAME/your_backend:$BRANCH_NAME_LOWER

# Используем Buildkit для сборки
docker build -t "$IMAGE" $ROOT

# Пушим образ в Docker Hub
docker push "$IMAGE"

echo --------------------------------------------------
echo Docker image: $IMAGE
echo --------------------------------------------------