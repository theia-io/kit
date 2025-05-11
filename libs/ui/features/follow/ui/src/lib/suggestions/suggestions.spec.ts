import {
  A,
  B,
  C,
  D,
  DB_USERS_20240713,
  E,
  ExperienceDates,
  F,
  G,
  K,
  L,
} from './experience.mocks';

const getExperienceIntersection = (
  { startDate: s1, endDate: e1 }: ExperienceDates,
  { startDate: s2, endDate: e2 }: ExperienceDates,
) => {
  const NOW = new Date();

  const s1Number = new Date(s1).getTime(),
    e1Number = (e1 ? new Date(e1) : NOW).getTime(),
    s2Number = new Date(s2).getTime(),
    e2Number = (e2 ? new Date(e2) : NOW).getTime();

  return (
    (s1Number - s2Number >= 0 && e2Number - s1Number >= 0) ||
    (s2Number - s1Number >= 0 && e1Number - s2Number >= 0)
  );
};

describe('Suggestions', () => {
  it('should return that A worked with C, D, E, F', () => {
    const result = [B, C, D, E, F, G, K, L].filter((experienceDates) =>
      getExperienceIntersection(A, experienceDates),
    );

    expect(result).toHaveLength(5);
    expect(result[0]).toEqual(C);
    expect(result[1]).toEqual(D);
    expect(result[2]).toEqual(E);
    expect(result[3]).toEqual(F);
    expect(result[4]).toEqual(K);
  });

  it('should return that B worked with C, D', () => {
    const result = [A, C, D, E, F, G, K, L].filter((experienceDates) =>
      getExperienceIntersection(B, experienceDates),
    );

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(C);
    expect(result[1]).toEqual(D);
  });

  //** @TODO @FIXME Huge performance bottleneck to fix */
  it('should return that B worked with C, D', () => {
    const [belohadk, danbilokha, ...reversedRest] = DB_USERS_20240713.reverse();

    const result = [danbilokha, ...reversedRest]
      .reverse()
      .filter((anotherUser) =>
        belohadk.experiences?.some((thisUserExperience) =>
          anotherUser.experiences?.some((anotherUserExperience) =>
            getExperienceIntersection(
              thisUserExperience as any,
              anotherUserExperience as any,
            ),
          ),
        ),
      );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(danbilokha);
  });
});
