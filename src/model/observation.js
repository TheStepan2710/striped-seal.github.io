/**
 * @typedef {Object} Observation
 * @property {number} lat
 * @property {number} lon
 * @property {string} timestampUtc
 * @property {number} count
 * @property {import('./species.js').Species[keyof import('./species.js').Species]} species
 */

export function observationDateKey(observation) {
  return observation.timestampUtc.slice(0, 10);
}
