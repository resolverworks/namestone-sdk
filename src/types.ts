type NameStoneResponse = NameStoneUser[];

type NameStoneUser = {
  name: string;
  address: string;
  domain: string;
  text_records: NameStoneTextRecords;
};

type NameStoneTextRecords =
  | Record<string, string>
  | {
      avatar?: string;
      description?: string;
    };

export { NameStoneResponse, NameStoneUser, NameStoneTextRecords };
