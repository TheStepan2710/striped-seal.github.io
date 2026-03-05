import { demoObservations, availableDateKeys } from './data/demoData.js';
import { observationDateKey } from './model/observation.js';
import { Species } from './model/species.js';
import { createCalendarModal, createFactsCard, createSpeciesDropdown, createTimelineChips } from './ui/components.js';
import { createHeatmapOverlay } from './ui/heatmap.js';
import { createMarkerLayer, initMap } from './ui/map.js';

const defaultState = {
  species: Species.SEALS,
  dateKey: '2026-02-23',
};

const state = {
  ...defaultState,
};

const map = initMap('map');
const heatmapCanvas = document.getElementById('heatmap-canvas');
const heatmap = createHeatmapOverlay(heatmapCanvas, map);
const factsCard = createFactsCard(document.getElementById('facts-card'));

const dropdown = createSpeciesDropdown(
  document.getElementById('species-dropdown'),
  state.species,
  (nextSpecies) => {
    state.species = nextSpecies;
    refresh();
  },
);

const chips = createTimelineChips(
  document.getElementById('timeline-chips'),
  availableDateKeys,
  state.dateKey,
  (nextDate) => {
    state.dateKey = nextDate;
    refresh();
  },
);

const calendarModal = createCalendarModal(
  document.getElementById('calendar-modal'),
  availableDateKeys,
  defaultState.dateKey,
  (nextDate) => {
    state.dateKey = nextDate;
    chips.setValue(nextDate);
    refresh();
  },
);

document.getElementById('calendar-btn').addEventListener('click', () => {
  calendarModal.open(state.dateKey);
});

const markerLayer = createMarkerLayer(map, (observation) => {
  const point = map.latLngToContainerPoint([observation.lat, observation.lon]);
  factsCard.show(observation, point, map.getSize());
});

function getFilteredObservations() {
  return demoObservations.filter(
    (observation) =>
      observation.species === state.species &&
      observationDateKey(observation) === state.dateKey,
  );
}

function refresh() {
  const filtered = getFilteredObservations();
  markerLayer.renderMarkers(filtered);
  heatmap.draw(filtered);
  factsCard.hide();
  dropdown.setValue(state.species);
}

map.on('move zoom resize', () => {
  heatmap.draw(getFilteredObservations());
  factsCard.hide();
});

window.addEventListener('resize', () => {
  map.invalidateSize();
  heatmap.resize();
  heatmap.draw(getFilteredObservations());
});

document.getElementById('app').addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (!target.closest('.leaflet-interactive') && !target.closest('#facts-card')) {
    factsCard.hide();
  }
});

const desktopOverlay = document.getElementById('desktop-overlay');
function syncDesktopOverlay() {
  const showWarning = window.innerWidth >= 900 && !sessionStorage.getItem('desktopOverlayDismissed');
  desktopOverlay.classList.toggle('hidden', !showWarning);
}

document.getElementById('desktop-dismiss').addEventListener('click', () => {
  sessionStorage.setItem('desktopOverlayDismissed', 'true');
  syncDesktopOverlay();
});

syncDesktopOverlay();
refresh();
