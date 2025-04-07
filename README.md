# Генетические варианты - REST API

Это приложение предоставляет REST API для поиска информации о генетических вариантах в базе данных Clinvar.

## Запуск локально

### Бэкенд

1. Создайте директорию `data` и поместите туда файл с данными `clinvar.vcf.gz`

Скачать файлы можно отсюда

- [БД Clinvar](https://ftp.ncbi.nlm.nih.gov/pub/clinvar/vcf_GRCh37/clinvar.vcf.gz)
- [Индекс TBI](https://ftp.ncbi.nlm.nih.gov/pub/clinvar/vcf_GRCh37/clinvar.vcf.gz.tbi)
2. Запустите бэкенд (по умолчанию порт 10300):
```bash
./gradlew run
```

Приложение будет доступно по адресу: **http://localhost:10300

### Фронтенд

1. Перейдите в директорию `frontend`:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите фронтенд (по умолчанию порт 10100):
```bash
npm start
```

Приложение будет доступно по адресу: **http://localhost:10100

## Запуск через Docker

1. **Докер-образ фронтенда**
   - Имя образа: `semenovfilipp/parseq-frontend:dev`
   - Порт: `10100`

2. **Докер-образ бэкенда**
   - Имя образа: `semenovfilipp/parseq-backend:dev`
   - Порт: `10300`

3. **Связь контейнеров**
   - Оба контейнера связаны в [docker-compose.yml](parseq-compose.yaml)

4. **Локальный запуск**
   - Используйте скрипт: **
   ```bash
   ./start-parseq.sh
   ```

## Деплой в Docker Hub

Для отправки образов в Docker Hub используйте скрипты:

1. **Фронтенд**
   ```bash
   ./build-frontend.sh
   ```

2. **Бэкенд**
   ```bash
   ./build-backend.sh
   ```

**Важно!**
Перед использованием скриптов:
- Укажите свой Docker Hub логин и токен внутри скриптов
- Убедитесь, что у вас есть права на запись в репозиторий

## API Endpoints

### GET /api/variants

Поиск информации о генетическом варианте.

Пример запроса:
```
http://localhost:10300/api/variants?rac=NC_000001.11&lap=66926&rap=66926&refKey=AG
```

Пример ответа:
```json
{
  "rac": "NC_000001.11",
  "lap": 925951,
  "rap": 925953,
  "refKey": "A",
  "vcfId": "1019397",
  "clnSig": "Uncertain_significance",
  "clnRevStat": "criteria_provided,_single_submitter",
  "clnVc": "NC_000001.11:925951-925953"
}
```

### Примеры запросов JSON

Поиск информации о генетическом варианте.

Пример запроса:
```json
{
  "rac": "NC_000001.11",
  "lap": 66926,
  "rap": 66926,
  "refKey": "AG"
}
```

Пример ответа:
```json
{
  "rac": "NC_000001.11",
  "lap": 925951,
  "rap": 925953,
  "refKey": "A",
  "vcfId": "1019397",
  "clnSig": "Uncertain_significance",
  "clnRevStat": "criteria_provided,_single_submitter",
  "clnVc": "NC_000001.11:925951-925953"
}
```

Дополнительные примеры запросов:

1. Поиск однонуклеотидного полиморфизма (SNP):
```json
{
  "rac": "NC_000001.11",
  "lap": 69134,
  "rap": 69134,
  "refKey": "A"
}
```

2. Поиск делеции:
```json
{
  "rac": "NC_000001.11",
  "lap": 3751728,
  "rap": 3751728,
  "refKey": "GT"
}
```

3. Поиск инсерции:
```json
{
  "rac": "NC_000001.11",
  "lap": 3751728,
  "rap": 3751728,
  "refKey": "G"
}
```

4. Поиск варианта в гене TARDBP:
```json
{
  "rac": "NC_000001.11",
  "lap": 11082442,
  "rap": 11082442,
  "refKey": "G"
}
```

5. Поиск варианта в гене CCDC27:
```json
{
  "rac": "NC_000001.11",
  "lap": 3669264,
  "rap": 3669264,
  "refKey": "G"
}
```

### Примеры CURL запросов

1. Поиск однонуклеотидного полиморфизма (SNP):
```
http://localhost:10300/api/variants?rac=NC_000001.11&lap=69134&rap=69134&refKey=A
```

2. Поиск делеции:
```
http://localhost:10300/api/variants?rac=NC_000001.11&lap=3751728&rap=3751728&refKey=GT
```

3. Поиск инсерции:
```
http://localhost:10300/api/variants?rac=NC_000001.11&lap=3751728&rap=3751728&refKey=G
```

4. Поиск варианта в гене TARDBP:
```
http://localhost:10300/api/variants?rac=NC_000001.11&lap=11082442&rap=11082442&refKey=G
```

5. Поиск варианта в гене CCDC27:
```
http://localhost:10300/api/variants?rac=NC_000001.11&lap=3669264&rap=3669264&refKey=G
```

