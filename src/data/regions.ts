import { RegionName } from '../types';

export interface RegionData {
  name: RegionName;
  description: string;
  states: string[];
}

export const INDIAN_REGIONS: Record<RegionName, RegionData> = {
  'South India': {
    name: 'South India',
    description: 'Andhra Pradesh, Telangana, Tamil Nadu, Karnataka, Kerala',
    states: ['Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Karnataka', 'Kerala']
  },
  'North India': {
    name: 'North India',
    description: 'Delhi, Punjab, Haryana, Uttar Pradesh, Uttarakhand, Himachal Pradesh, Jammu & Kashmir, Rajasthan',
    states: ['Delhi', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Uttarakhand', 'Himachal Pradesh', 'Jammu & Kashmir', 'Rajasthan']
  },
  'West India': {
    name: 'West India',
    description: 'Maharashtra, Gujarat, Goa, Rajasthan',
    states: ['Maharashtra', 'Gujarat', 'Goa', 'Rajasthan']
  },
  'East India': {
    name: 'East India',
    description: 'West Bengal, Odisha, Bihar, Jharkhand',
    states: ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand']
  },
  'Northeast India': {
    name: 'Northeast India',
    description: 'Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh, Sikkim',
    states: ['Assam', 'Meghalaya', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura', 'Arunachal Pradesh', 'Sikkim']
  }
};

export const ALL_STATES: { state: string; region: RegionName }[] = Object.entries(INDIAN_REGIONS).flatMap(
  ([regionKey, data]) => data.states.map(state => ({ state, region: regionKey as RegionName }))
);

export const STATE_TO_REGION_MAP: Record<string, RegionName> = {};
ALL_STATES.forEach(item => {
  STATE_TO_REGION_MAP[item.state] = item.region;
});
