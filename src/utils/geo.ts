// src/utils/geo.ts
import { Country, State } from 'country-state-city';

export type Option = { label: string; value: string };

export function getCountryOptions(): Option[] {
  return Country.getAllCountries().map((c) => ({
    label: c.name,
    value: c.isoCode, // e.g. "NG"
  }));
}

export function getStateOptions(countryIso2?: string): Option[] {
  if (!countryIso2) return [];
  return State.getStatesOfCountry(countryIso2).map((s) => ({
    label: s.name,
    value: s.isoCode || s.name,
  }));
}
