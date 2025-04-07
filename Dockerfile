# Этап сборки
FROM gradle:8.5-jdk17 AS build
WORKDIR /app

# Копируем только файлы, необходимые для загрузки зависимостей
COPY build.gradle.kts settings.gradle.kts gradle.properties ./
COPY gradle ./gradle

# Загружаем зависимости (этот слой будет кэшироваться)
RUN gradle dependencies --no-daemon

# Копируем исходный код
COPY src ./src
COPY data ./data

# Собираем приложение
RUN gradle build --no-daemon

# Финальный образ
FROM openjdk:17-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
COPY --from=build /app/data ./data

EXPOSE 10300

ENTRYPOINT ["java", "-jar", "app.jar"]