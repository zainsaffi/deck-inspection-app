// Dropdown options for inspection subcategories
// Based on the Scope of Work and App Flow documents

export const RAILING_TYPES = [
  'Wood framed with siding on both sides',
  'Wood framed with siding on the outside only',
  'Wood framed with no siding',
  'Metal railings with wood top cap',
  'Metal railings only',
  'Glass panels with metal frame',
  'Cable railings with wood posts',
  'Composite/vinyl railings',
];

export const DECK_SURFACE_TYPES = [
  'Redwood planks spaced for drainage',
  'Pressure-treated planks spaced for drainage',
  'Composite planks spaced for drainage',
  'Concrete with waterproof membrane',
  'Tile over waterproof membrane',
  'Plywood with waterproof membrane',
  'Metal decking',
  'Other',
];

export const FRAME_TYPES = [
  'Wood (non-treated) ledger and joists on post and beam construction',
  'Wood (pressure-treated) ledger and joists on post and beam construction',
  'Wood ledger and joists cantilevered from floor framing',
  'Steel frame with wood decking',
  'Concrete structure',
  'Other',
];

export const STAIR_TYPES = [
  'Single metal stringer, concrete steps, open risers with metal railings',
  'Double metal stringer with metal treads and metal railings',
  'Wood stringers with wood treads and wood railings',
  'Wood stringers with wood treads and metal railings',
  'Concrete stairs with metal railings',
  'Prefabricated metal stairs',
  'Other',
];

export type FindingStatus = 'red' | 'yellow' | 'blue' | 'green';

export const FINDING_STATUSES: {
  key: FindingStatus;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    key: 'red',
    label: 'Immediate Action Required',
    description: 'Immediate action is required.',
    color: '#ED1C24',
  },
  {
    key: 'yellow',
    label: 'Repairs Required ASAP',
    description: 'Repairs are required as soon as possible.',
    color: '#FFF200',
  },
  {
    key: 'blue',
    label: 'Maintenance Required',
    description: 'Maintenance is required as soon as possible.',
    color: '#0072BC',
  },
  {
    key: 'green',
    label: 'No Problems Found',
    description: 'No problems found at this time.',
    color: '#8CC63F',
  },
];

export const SUBCATEGORIES = [
  'railings',
  'caulking',
  'surface',
  'framing',
  'stairs',
] as const;

export type SubCategory = typeof SUBCATEGORIES[number];

export const SUBCATEGORY_LABELS: Record<SubCategory, string> = {
  railings: 'Railings',
  caulking: 'Flashing and Caulking',
  surface: 'Deck Surface',
  framing: 'Frame',
  stairs: 'Stairs',
};

export const SUBCATEGORY_TYPE_OPTIONS: Partial<Record<SubCategory, string[]>> = {
  railings: RAILING_TYPES,
  surface: DECK_SURFACE_TYPES,
  framing: FRAME_TYPES,
  stairs: STAIR_TYPES,
};
