import { speciesMeta, speciesOptions } from '../model/species.js';

const WEEKDAYS = {
  '2026-02-21': 'Сб',
  '2026-02-22': 'Вс',
  '2026-02-23': 'Пн',
  '2026-02-24': 'Вт',
  '2026-02-25': 'Ср',
};

function formatScaleLabel(dateKey) {
  return `${WEEKDAYS[dateKey] || ''}, ${dateKey.slice(-2)}`;
}

export function createSpeciesDropdown(container, initialValue, onChange) {
  let isOpen = false;
  let current = initialValue;

  const button = document.createElement('button');
  button.className = 'control-btn species-trigger';

  const menu = document.createElement('div');
  menu.className = 'dropdown-menu hidden';

  function renderButton() {
    const meta = speciesMeta[current];
    button.innerHTML = `<span>${meta.icon}</span><span class="species-name">${meta.label}</span><span>▾</span>`;
  }

  function renderMenu() {
    menu.innerHTML = '';
    speciesOptions.forEach((species) => {
      const item = document.createElement('button');
      item.className = `dropdown-item ${species === current ? 'active' : ''}`;
      const meta = speciesMeta[species];
      item.innerHTML = `
        <span>${meta.icon}</span>
        <span>${meta.label}</span>
        ${meta.pro ? '<span class="pro-badge">PRO</span>' : ''}
      `;
      item.addEventListener('click', () => {
        current = species;
        isOpen = false;
        onChange(species);
        sync();
      });
      menu.appendChild(item);
    });
  }

  function sync() {
    renderButton();
    renderMenu();
    menu.classList.toggle('hidden', !isOpen);
    container.classList.toggle('open', isOpen);
  }

  button.addEventListener('click', (event) => {
    event.stopPropagation();
    isOpen = !isOpen;
    sync();
  });

  document.addEventListener('click', () => {
    if (isOpen) {
      isOpen = false;
      sync();
    }
  });

  container.append(button, menu);
  sync();

  return {
    setValue(nextValue) {
      current = nextValue;
      sync();
    },
  };
}

export function createTimelineScale(container, dateKeys, initialDate, onChange) {
  let current = initialDate;

  const track = document.createElement('div');
  track.className = 'timeline-track';
  container.appendChild(track);

  function render() {
    track.innerHTML = '';
    dateKeys.forEach((dateKey) => {
      const point = document.createElement('button');
      point.className = `timeline-point ${dateKey === current ? 'selected' : ''}`;
      point.innerHTML = `
        <span class="timeline-dot" aria-hidden="true"></span>
        <span class="timeline-label">${formatScaleLabel(dateKey)}</span>
      `;
      point.addEventListener('click', () => {
        current = dateKey;
        onChange(dateKey);
        render();
        point.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
      });
      track.appendChild(point);
    });
  }

  render();

  return {
    setValue(nextDate) {
      current = nextDate;
      render();
    },
  };
}

export function createCalendarModal(container, dateKeys, defaultDate, onApply) {
  let tempSelected = defaultDate;

  function open(currentDate) {
    tempSelected = currentDate;
    render();
    container.classList.remove('hidden');
    container.setAttribute('aria-hidden', 'false');
  }

  function close() {
    container.classList.add('hidden');
    container.setAttribute('aria-hidden', 'true');
  }

  function render() {
    const enabled = new Set(dateKeys.map((key) => Number(key.slice(-2))));
    const tempDay = Number(tempSelected.slice(-2));

    container.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-sheet">
        <div class="sheet-header">
          <h3>Февраль 2026</h3>
        </div>
        <div class="calendar-grid" role="grid"></div>
        <div class="sheet-actions">
          <button data-action="clear">Очистить</button>
          <button data-action="cancel">Отмена</button>
          <button data-action="ok" class="primary-btn">ОК</button>
        </div>
      </div>
    `;

    const grid = container.querySelector('.calendar-grid');
    const firstWeekdayOffset = 6;

    for (let index = 0; index < firstWeekdayOffset; index += 1) {
      const empty = document.createElement('div');
      empty.className = 'day-cell empty';
      grid.appendChild(empty);
    }

    for (let day = 1; day <= 28; day += 1) {
      const button = document.createElement('button');
      const selectable = enabled.has(day);
      button.className = `day-cell ${selectable ? '' : 'disabled'} ${tempDay === day ? 'selected' : ''}`;
      button.textContent = day;
      button.disabled = !selectable;
      if (selectable) {
        button.addEventListener('click', () => {
          tempSelected = `2026-02-${String(day).padStart(2, '0')}`;
          render();
        });
      }
      grid.appendChild(button);
    }

    container.querySelector('.modal-backdrop').addEventListener('click', close);
    container.querySelector('[data-action="cancel"]').addEventListener('click', close);
    container.querySelector('[data-action="ok"]').addEventListener('click', () => {
      onApply(tempSelected);
      close();
    });
    container.querySelector('[data-action="clear"]').addEventListener('click', () => {
      onApply(defaultDate);
      close();
    });
  }

  render();

  return { open, close };
}

export function createFactsCard(container) {
  let activeObservation = null;

  function formatTimestamp(timestampUtc) {
    const date = new Date(timestampUtc);
    const hh = String(date.getUTCHours()).padStart(2, '0');
    const mm = String(date.getUTCMinutes()).padStart(2, '0');
    const dateLabel = new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    }).format(date);

    return `${hh}:${mm} UTC, ${dateLabel}`;
  }

  function hide() {
    activeObservation = null;
    container.classList.add('hidden');
  }

  function show(observation, point, mapRect) {
    if (activeObservation === observation) {
      hide();
      return;
    }

    activeObservation = observation;
    const meta = speciesMeta[observation.species];
    container.innerHTML = `
      <p><strong>Вид:</strong> ${meta.label}</p>
      <p>~${observation.count} шт</p>
      <p>Обновлено: ${formatTimestamp(observation.timestampUtc)}</p>
    `;

    const width = 220;
    const height = 110;
    const gap = 12;
    let left = point.x + gap;
    let top = point.y - height - gap;

    if (left + width > mapRect.width - 12) {
      left = point.x - width - gap;
    }
    if (left < 12) {
      left = 12;
    }
    if (top < 12) {
      top = point.y + gap;
    }

    container.style.left = `${left}px`;
    container.style.top = `${top}px`;
    container.classList.remove('hidden');
  }

  return {
    show,
    hide,
    get activeObservation() {
      return activeObservation;
    },
  };
}
