import { AuthenticationError, MissingDataError, NetworkError } from "./errors";
import type { CoinTypes, DomainData, NameData, TextRecords } from "./types";

interface SetNameParams {
  name: string;
  domain: string;
  address: string;
  contenthash?: string;
  text_records?: TextRecords;
  coin_types?: CoinTypes;
}

interface ClaimNameParams {
  name: string;
  domain: string;
  address: string;
  contenthash?: string;
  text_records?: TextRecords;
}

interface GetNamesParams {
  domain?: string;
  address?: string;
  text_records?: boolean;
  limit?: number;
  offset?: number;
}

interface SearchNamesParams {
  domain: string;
  name: string;
  text_records?: boolean;
  limit?: number;
  exact_match?: boolean;
  offset?: number;
}

interface DeleteNameParams {
  name: string;
  domain: string;
}

interface SetDomainParams {
  domain: string;
  address: string;
  contenthash?: string;
  text_records?: TextRecords;
}

class NameStone {
  private baseUrl = "https://namestone.xyz/api/public_v1";
  private headers: HeadersInit;

  /**
   * Creates a NameStone instance.
   * @param apiKey - NameStone API key for authentication.
   */
  constructor(apiKey: string) {
    this.headers = new Headers({
      "Content-Type": "application/json",
      Authorization: apiKey,
    });
  }

  private async request<T>(endpoint: string, method: string, data?: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      method,
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined,
    };

    const res = await fetch(url, config);

    if (!res.ok) {
      if (res.status === 401) {
        throw new AuthenticationError("Authentication failed");
      }
      throw new NetworkError(`HTTP error! status: ${res.status}`);
    }

    return res.json();
  }

  /**
   * Sets a name with associated data.
   * @param params - The parameters for setting a name.
   * @returns A promise that resolves when the name is set.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async setName(params: SetNameParams): Promise<void> {
    await this.request("/set-name", "POST", params);
  }

  /**
   * Claims a name with associated data.
   * @param params - The parameters for claiming a name.
   * @returns A promise that resolves when the name is claimed.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async claimName(params: ClaimNameParams): Promise<void> {
    await this.request("/claim-name", "POST", params);
  }

  /**
   * Retrieves names based on specified criteria.
   * @param params - The parameters for retrieving names.
   * @returns A promise that resolves to an array of NameData.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async getNames(params: GetNamesParams): Promise<NameData[]> {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    }
    const endpoint = `/get-names?${queryParams.toString()}`;
    return this.request<NameData[]>(endpoint, "GET");
  }

  /**
   * Searches for names based on specified criteria.
   * @param params - The parameters for searching names.
   * @returns A promise that resolves to an array of NameData.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async searchNames(params: SearchNamesParams): Promise<NameData[]> {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    }
    const endpoint = `/search-names?${queryParams.toString()}`;
    return this.request<NameData[]>(endpoint, "GET");
  }

  /**
   * Deletes a name from the specified domain.
   * @param params - The parameters for deleting a name.
   * @returns A promise that resolves when the name is deleted.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async deleteName(params: DeleteNameParams): Promise<void> {
    await this.request("/delete-name", "POST", params);
  }

  /**
   * Sets domain data.
   * @param params - The parameters for setting a domain.
   * @returns A promise that resolves when the domain is set.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async setDomain(params: SetDomainParams): Promise<void> {
    await this.request("/set-domain", "POST", params);
  }

  /**
   * Retrieves domain data.
   * @param domain - Optional domain to retrieve data for.
   * @returns A promise that resolves to an array of DomainData.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async getDomain(domain?: string): Promise<DomainData[]> {
    const params = new URLSearchParams();
    if (domain) params.append("domain", domain);

    const endpoint = `/get-domain?${params.toString()}`;
    return this.request<DomainData[]>(endpoint, "GET");
  }
}
export { AuthenticationError, MissingDataError, NetworkError };
export default NameStone;
