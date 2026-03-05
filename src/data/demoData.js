import { Species } from '../model/species.js';

export const availableDateKeys = [
  '2026-02-21',
  '2026-02-22',
  '2026-02-23',
  '2026-02-24',
  '2026-02-25',
];

export const demoObservations = [
  { lat: 53.35, lon: 142.85, timestampUtc: '2026-02-21T04:20:00Z', count: 22, species: Species.SEALS },
  { lat: 55.6, lon: 150.2, timestampUtc: '2026-02-21T08:10:00Z', count: 36, species: Species.SEALS },
  { lat: 54.7, lon: 143.9, timestampUtc: '2026-02-22T06:35:00Z', count: 44, species: Species.SEALS },
  { lat: 57.2, lon: 152.4, timestampUtc: '2026-02-23T06:02:00Z', count: 26, species: Species.SEALS },
  { lat: 52.9, lon: 145.1, timestampUtc: '2026-02-23T11:15:00Z', count: 58, species: Species.SEALS },
  { lat: 54.4, lon: 149.5, timestampUtc: '2026-02-24T07:50:00Z', count: 31, species: Species.SEALS },
  { lat: 56.1, lon: 151.1, timestampUtc: '2026-02-25T05:15:00Z', count: 47, species: Species.SEALS },

  { lat: 53.9, lon: 143.4, timestampUtc: '2026-02-21T09:45:00Z', count: 14, species: Species.CRABS },
  { lat: 55.1, lon: 146.7, timestampUtc: '2026-02-22T10:25:00Z', count: 29, species: Species.CRABS },
  { lat: 56.8, lon: 150.8, timestampUtc: '2026-02-23T03:40:00Z', count: 12, species: Species.CRABS },
  { lat: 54.2, lon: 148.8, timestampUtc: '2026-02-24T12:20:00Z', count: 37, species: Species.CRABS },
  { lat: 52.4, lon: 144.2, timestampUtc: '2026-02-25T07:30:00Z', count: 19, species: Species.CRABS },

  { lat: 58.3, lon: 154.5, timestampUtc: '2026-02-22T01:10:00Z', count: 3, species: Species.BEARS },
  { lat: 57.7, lon: 153.3, timestampUtc: '2026-02-23T02:55:00Z', count: 5, species: Species.BEARS },
  { lat: 56.9, lon: 151.6, timestampUtc: '2026-02-25T06:45:00Z', count: 2, species: Species.BEARS },

  { lat: 53.1, lon: 145.8, timestampUtc: '2026-02-21T13:05:00Z', count: 65, species: Species.FISH },
  { lat: 55.9, lon: 149.3, timestampUtc: '2026-02-22T05:20:00Z', count: 54, species: Species.FISH },
  { lat: 54.8, lon: 147.4, timestampUtc: '2026-02-23T08:00:00Z', count: 73, species: Species.FISH },
  { lat: 56.2, lon: 150.5, timestampUtc: '2026-02-24T09:35:00Z', count: 41, species: Species.FISH },
  { lat: 52.7, lon: 143.6, timestampUtc: '2026-02-25T04:50:00Z', count: 62, species: Species.FISH },
];
