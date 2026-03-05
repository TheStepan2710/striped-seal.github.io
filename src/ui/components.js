import { speciesMeta, speciesOptions } from '../model/species.js';

const WEEKDAYS = {
  '2026-02-21': 'сб',
  '2026-02-22': 'вс',
  '2026-02-23': 'пн',
  '2026-02-24': 'вт',
  '2026-02-25': 'ср',
};

function labelFor(dateKey) {
  return `${WEEKDAYS[dateKey]}, ${dateKey.slice(-2)}`;
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
      item.innerHTML = `<span>${meta.icon}</span><span>${meta.label}</span>${meta.pro ? '<span class="pro-badge">PRO</span>' : ''}`;
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
  let isSnapping = false;

  const viewport = document.createElement('div');
  viewport.className = 'timeline-viewport';
  const track = document.createElement('div');
  track.className = 'timeline-track';
  const indicator = document.createElement('div');
  indicator.className = 'timeline-indicator';

  viewport.append(track, indicator);
  container.appendChild(viewport);

  function renderItems() {
    track.innerHTML = '';
    dateKeys.forEach((dateKey) => {
      const item = document.createElement('div');
      item.className = `timeline-item ${dateKey === current ? 'selected' : ''}`;
      item.dataset.dateKey = dateKey;
      item.textContent = labelFor(dateKey);
      track.appendChild(item);
    });
  }

  function getClosestDateToCenter() {
    const centerX = viewport.scrollLeft + viewport.clientWidth / 2;
    let best = dateKeys[0];
    let minDistance = Infinity;

    [...track.children].forEach((node) => {
      const item = node;
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(itemCenter - centerX);
      if (distance < minDistance) {
        minDistance = distance;
        best = item.dataset.dateKey;
      }
    });

    return best;
  }

  function scrollToDate(dateKey, smooth = true) {
    const target = [...track.children].find((node) => node.dataset.dateKey === dateKey);
    if (!target) return;
    const targetLeft = target.offsetLeft - viewport.clientWidth / 2 + target.offsetWidth / 2;
    viewport.scrollTo({ left: targetLeft, behavior: smooth ? 'smooth' : 'auto' });
  }

  let scrollTimer;
  viewport.addEventListener('scroll', () => {
    if (isSnapping) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const nearest = getClosestDateToCenter();
      if (nearest !== current) {
        current = nearest;
        onChange(nearest);
      }
      renderItems();
      isSnapping = true;
      scrollToDate(current, true);
      setTimeout(() => {
        isSnapping = false;
      }, 180);
    }, 80);
  });

  renderItems();
  setTimeout(() => scrollToDate(initialDate, false), 0);

  return {
    setValue(nextDate) {
      current = nextDate;
      renderItems();
      scrollToDate(nextDate, true);
    },
  };
}

export function createCalendarModal(container, dateKeys, defaultDate, onApply) {
  const dateInput = document.getElementById('material-date-input');
  const applyButton = document.getElementById('calendar-apply');
  const clearButton = document.getElementById('calendar-clear');
  const cancelButton = document.getElementById('calendar-cancel');
  let current = defaultDate;

  function open(activeDate) {
    current = activeDate;
    dateInput.value = activeDate;
    container.classList.remove('hidden');
  }

  function close() {
    container.classList.add('hidden');
  }

  applyButton.addEventListener('click', () => {
    const value = dateInput.value || defaultDate;
    if (dateKeys.includes(value)) {
      onApply(value);
    } else {
      onApply(defaultDate);
    }
    close();
  });

  clearButton.addEventListener('click', () => {
    onApply(defaultDate);
    close();
  });

  cancelButton.addEventListener('click', close);

  container.querySelector('.modal-backdrop').addEventListener('click', close);

  dateInput.addEventListener('change', () => {
    const min = dateKeys[0];
    const max = dateKeys[dateKeys.length - 1];
    if (dateInput.value < min || dateInput.value > max) {
      dateInput.value = current;
    }
  });

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

    if (left + width > mapRect.width - 12) left = point.x - width - gap;
    if (left < 12) left = 12;
    if (top < 12) top = point.y + gap;

    container.style.left = `${left}px`;
    container.style.top = `${top}px`;
    container.classList.remove('hidden');
  }

  return { show, hide };
}
