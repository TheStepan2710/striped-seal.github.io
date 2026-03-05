export const Species = Object.freeze({
  SEALS: 'SEALS',
  CRABS: 'CRABS',
  BEARS: 'BEARS',
  FISH: 'FISH',
});

export const speciesMeta = {
  [Species.SEALS]: { label: 'Полосатые тюлени', icon: '🦭', pro: false },
  [Species.CRABS]: { label: 'Крабы', icon: '🦀', pro: false },
  [Species.BEARS]: { label: 'Медведи', icon: '🐻', pro: true },
  [Species.FISH]: { label: 'Рыба', icon: '🐟', pro: false },
};

export const speciesOptions = Object.values(Species);
