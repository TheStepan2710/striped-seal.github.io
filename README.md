# Sea of Okhotsk Mobile Prototype

Статический mobile-first прототип для GitHub Pages: карта Охотского моря (Leaflet + OSM), тепловая карта на canvas, выбор даты (чипы + календарь), выбор вида и карточка фактов по маркеру.

## Структура проекта

```text
.
├── .nojekyll
├── index.html
├── README.md
├── assets/
├── styles/
│   └── main.css
└── src/
    ├── app.js
    ├── data/
    │   └── demoData.js
    ├── model/
    │   ├── observation.js
    │   └── species.js
    └── ui/
        ├── components.js
        ├── heatmap.js
        └── map.js
```

## Локальный запуск

Можно открыть `index.html` напрямую, но для стабильной работы модулей лучше запустить простой сервер:

```bash
python3 -m http.server 8080
```

После запуска откройте: `http://localhost:8080`

## Деплой на GitHub Pages

1. Запушьте проект в репозиторий `<user>/<repo>`.
2. В GitHub: **Settings → Pages**.
3. В разделе **Build and deployment** выберите:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (или ваш branch), `/ (root)`
4. Сохраните и дождитесь публикации.
5. Сайт будет доступен по адресу вида `https://<user>.github.io/<repo>/`.

Файлы и пути сделаны относительными, поэтому проект корректно работает под поддиректорией репозитория.

## Карта OSM

- Используется Leaflet (CDN) + слой плиток OpenStreetMap:
  `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- Показана атрибуция `© OpenStreetMap contributors`.
- Плитки подгружаются только для текущего viewport.

## Где лежат демо-данные

- Набор наблюдений: `src/data/demoData.js`
- Модель вида и подписи: `src/model/species.js`
- Помощник фильтрации по дате: `src/model/observation.js`

## Как работает тепловая карта

1. Данные фильтруются по выбранной дате и виду.
2. Каждая гео-точка проецируется в пиксели контейнера через Leaflet `latLngToContainerPoint`.
3. На canvas рисуются радиальные градиенты с интенсивностью от `count`.
4. Палитра: жёлтый → оранжевый → красный.
5. Перерисовка выполняется при pan/zoom/resize и смене фильтров.

## Ограничения прототипа

- Это демонстрационный прототип без backend.
- Точность heatmap визуальная, не научная.
- Desktop-режим показывает предупреждение, т.к. UX оптимизирован под мобильные устройства.
- Не используется офлайн-кэширование, bulk download, prefetch или scraping OSM-тайлов.
