import NameStone from "./client";
export default NameStone;

import { TextRecords, CoinTypes, NameData, DomainData } from "./types";
export type { TextRecords, CoinTypes, NameData, DomainData };

import { MissingDataError, NetworkError, AuthenticationError } from "./errors";
export { MissingDataError, NetworkError, AuthenticationError };
