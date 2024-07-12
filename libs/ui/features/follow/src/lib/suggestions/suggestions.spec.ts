import { A, E, ExperienceDates, F, G, K, L } from './experience.mocks';

const getExperienceIntersection = (
  { startDate: s1, endDate: e1 }: ExperienceDates,
  { startDate: s2, endDate: e2 }: ExperienceDates
) => {
  const NOW = new Date();

  const s1Number = new Date(s1).getTime(),
    e1Number = (e1 ? new Date(e1) : NOW).getTime(),
    s2Number = new Date(s2).getTime(),
    e2Number = (e2 ? new Date(e2) : NOW).getTime();

  // return (s1 >= s2 && s1 <= (e2 ?? (new Date).toISOString()))
  //     || (s2 >= s1 && s2 <= (e1 ?? (new Date).toISOString()));
  return (
    (s1Number - s2Number > 0 && e2Number - s1Number > 0) ||
    (s2Number - s1Number > 0 && e1Number - s2Number > 0)
  );
};

describe('Suggestions', () => {
  it('should return that A worked with C, D, E, F', () => {
    const result = [B, C, D, E, F, G, K, L].filter((experienceDates) =>
      getExperienceIntersection(A, experienceDates)
    );

    expect(result).toHaveLength(4);
    expect(result[0]).toEqual(C);
    expect(result[1]).toEqual(D);
    expect(result[2]).toEqual(E);
    expect(result[3]).toEqual(F);
  });

  const B: ExperienceDates = {
    title: 'B',
    startDate: '2020-03-31T22:00:00.000Z',
    endDate: '2021-06-31T22:00:00.000Z',
  };
  const C: ExperienceDates = {
    title: 'C',
    startDate: '2020-03-31T22:00:00.000Z',
    endDate: '2022-11-31T22:00:00.000Z',
  };

  const D: ExperienceDates = {
    title: 'D',
    startDate: '2020-03-31T22:00:00.000Z',
    endDate: '2024-03-31T22:00:00.000Z',
  };
  it('should return that B worked with C, D', () => {
    const result = [A, C, D, E, F, G, K, L].filter((experienceDates) =>
      getExperienceIntersection(B, experienceDates)
    );

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(C);
    expect(result[1]).toEqual(D);
  });
});
