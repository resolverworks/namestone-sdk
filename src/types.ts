type TextRecords = {
  [key: string]: string;
};

type CoinTypes = {
  [key: string]: string;
};

type NameData = {
  name: string;
  address: string;
  domain: string;
  text_records?: TextRecords;
  coin_types?: CoinTypes;
};

type DomainData = {
  domain: string;
  address: string;
  text_records?: TextRecords;
  coin_types?: CoinTypes;
};

export type { TextRecords, CoinTypes, NameData, DomainData };
