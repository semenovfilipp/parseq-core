#!/bin/bash

# Функция для освобождения порта
function free_port {
    local PORT=$1
    # Найдите PID процесса, который использует порт
    local PID=$(sudo lsof -ti :$PORT)

    if [ -n "$PID" ]; then
        echo "Освобождаем порт $PORT, завершение процесса $PID."
        # Завершите процесс
        sudo kill -9 $PID
        # Проверка успешности завершения
        if [ $? -eq 0 ]; then
            echo "Процесс $PID успешно завершен."
        else
            echo "Не удалось завершить процесс $PID."
        fi
    else
        echo "Порт $PORT уже свободен."
    fi
}

# Освобождаем порты
free_port 10300
free_port 80
free_port 8080
free_port 10100

# Остановка и удаление контейнеров, использующих нужные порты
echo "Останавливаем и удаляем контейнеры, использующие порты..."
docker ps -a | grep -E "10100|10300" | awk '{print $1}' | xargs --no-run-if-empty docker rm -f

docker-compose -f parseq-compose.yaml down -v

# Обновление образов
docker-compose -f parseq-compose.yaml pull

# Запуск контейнеров
docker-compose -f parseq-compose.yaml up -d --remove-orphans