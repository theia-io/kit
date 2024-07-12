import { Experience } from '@kitouch/shared/models';

export type ExperienceDates = Pick<
  Experience,
  'title' | 'startDate' | 'endDate'
>;

export const A: ExperienceDates = {
  title: 'A',
  startDate: '2022-03-31T22:00:00.000Z',
  endDate: '2023-06-31T22:00:00.000Z',
};

export const B: ExperienceDates = {
  title: 'B',
  startDate: '2020-03-31T22:00:00.000Z',
  endDate: '2021-06-31T22:00:00.000Z',
};

export const C: ExperienceDates = {
  title: 'C',
  startDate: '2020-03-31T22:00:00.000Z',
  endDate: '2022-11-31T22:00:00.000Z',
};

export const D: ExperienceDates = {
  title: 'D',
  startDate: '2020-03-31T22:00:00.000Z',
  endDate: '2024-03-31T22:00:00.000Z',
};
export const E: ExperienceDates = {
  title: 'E',
  startDate: '2022-04-31T22:00:00.000Z',
  endDate: '2023-02-31T22:00:00.000Z',
};
export const F: ExperienceDates = {
  title: 'F',
  startDate: '2022-05-31T22:00:00.000Z',
  endDate: '2024-02-31T22:00:00.000Z',
};

export const G: ExperienceDates = {
  title: 'G',
  startDate: '2024-01-31T22:00:00.000Z',
  endDate: '2024-05-31T22:00:00.000Z',
};
export const K: ExperienceDates = {
  title: 'K',
  startDate: '2022-03-31T22:00:00.000Z',
  endDate: null,
};
export const L: ExperienceDates = {
  title: 'L',
  startDate: '2024-01-31T22:00:00.000Z',
  endDate: null,
};
