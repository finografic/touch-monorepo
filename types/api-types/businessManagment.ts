export const CountriesTransformer = {
  fromApi: (data: CountryResponseBody[]): CountryData[] => {
    return data.map((country) => ({
      name: /* istanbul ignore next */ country.LocalName ? country.LocalName : country.Name,
      countryCode: country.Alpha2Code,
    }));
  },
};
