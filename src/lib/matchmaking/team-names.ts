const PREFIXES = [
  'Sealevel',
  'Lamport',
  'Validator',
  'SPL',
  'Epoch',
  'Slot',
  'Orbit',
  'Runtime',
  'Proof of History',
  'Turbine',
  'Gulf Stream',
  'Anchor',
  'Solstice',
  'Lattice',
  'Drift',
  'Neon',
  'Helio',
  'Genesis',
  'Aurora',
  'Nova',
];

const SUFFIXES = [
  'Builders',
  'Labs',
  'Collective',
  'Squad',
  'Crew',
  'Protocol',
  'Works',
  'Foundry',
  'Forge',
  'Nexus',
  'Flow',
  'Circuit',
  'Signal',
  'Engine',
  'Wave',
  'Core',
  'Guild',
  'Studio',
  'Orbit',
  'Network',
  'Alliance',
  'Stack',
  'Hub',
  'Node',
  'Vector',
  'Pulse',
  'Mint',
  'Bridge',
  'Layer',
  'Rail',
  'Mesh',
  'Dock',
  'Arc',
  'Module',
  'Sphere',
  'Grid',
  'Vault',
  'Loop',
  'Sync',
  'Unit',
];

export function getAllTeamNames(): string[] {
  return PREFIXES.flatMap((prefix) => SUFFIXES.map((suffix) => `${prefix} ${suffix}`));
}

export function generateTeamName(): string {
  const allNames = getAllTeamNames();
  return allNames[Math.floor(Math.random() * allNames.length)];
}

export function generateUniqueTeamName(usedNames: Set<string>): string {
  const availableNames = getAllTeamNames().filter((name) => !usedNames.has(name));

  if (availableNames.length === 0) {
    throw new Error('Team name pool exhausted');
  }

  const pickedName = availableNames[Math.floor(Math.random() * availableNames.length)];
  usedNames.add(pickedName);
  return pickedName;
}
