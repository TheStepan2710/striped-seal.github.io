# Sea of Okhotsk Mobile Prototype

Статический mobile-first прототип для GitHub Pages: карта Охотского моря (Leaflet + OSM), зональная карта концентрации на canvas, шкала дат в стиле погодных приложений, Material Design календарь, выбор вида и карточка фактов.

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

```bash
python3 -m http.server 8080
```

Откройте: `http://localhost:8080`.

## Деплой на GitHub Pages

1. Push в GitHub репозиторий.
2. `Settings → Pages`.
3. `Deploy from a branch` → `main` (или другая ветка) / `root`.

## Карта и тайлы

- Leaflet + OpenStreetMap raster tiles over HTTPS.
- Атрибуция `© OpenStreetMap contributors` видима на карте.
- Плитки не кэшируются bulk-способом и не префетчатся.

## Где данные и как работает визуализация

- Демо-данные: `src/data/demoData.js`.
- Зоны концентрации: `src/ui/heatmap.js`.
- Для каждой точки наблюдения координаты сначала проецируются через `map.latLngToContainerPoint`, затем строится плотностное поле по сетке и раскрашивается ступенчатым градиентом низкая/умеренная/высокая.
- Дополнительно поверх зон отрисовываются направляющие стрелки миграции.

## UI детали

- Нижний переключатель дат реализован как прокручиваемая шкала с центральным красным индикатором.
- По бокам шкалы: кнопка перехода к базовой («сегодня») дате и кнопка открытия календаря.
- Календарь в нижнем листе использует Material Design Web components (`@material/web`).
