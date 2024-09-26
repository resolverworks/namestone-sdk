import { AuthenticationError, MissingDataError, NetworkError } from "./errors";
import type { CoinTypes, DomainData, NameData, TextRecords } from "./types";

export class NameStone {
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
   * @param name - The name to set.
   * @param domain - The domain for the name.
   * @param address - The address associated with the name.
   * @param contenthash - Optional content hash.
   * @param text_records - Optional text records.
   * @param coin_types - Optional coin types.
   * @returns A promise that resolves when the name is set.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async setName(
    name: string,
    domain: string,
    address: string,
    contenthash?: string,
    text_records?: TextRecords,
    coin_types?: CoinTypes,
  ): Promise<void> {
    const data = {
      name,
      domain,
      address,
      contenthash,
      text_records,
      coin_types,
    };
    await this.request("/set-name", "POST", data);
  }

  /**
   * Claims a name with associated data.
   * @param name - The name to claim.
   * @param domain - The domain for the name.
   * @param address - The address associated with the name.
   * @param contenthash - Optional content hash.
   * @param text_records - Optional text records.
   * @param single_claim - Optional flag for single claim.
   * @returns A promise that resolves when the name is claimed.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async claimName(
    name: string,
    domain: string,
    address: string,
    contenthash?: string,
    text_records?: TextRecords,
    single_claim?: boolean,
  ): Promise<void> {
    const data = { name, domain, address, contenthash, text_records };
    const endpoint = `/claim-name${single_claim ? "?single_claim=1" : ""}`;
    await this.request(endpoint, "POST", data);
  }

  /**
   * Retrieves names based on specified criteria.
   * @param domain - Optional domain to filter names.
   * @param address - Optional address to filter names.
   * @param text_records - Optional flag to include text records.
   * @param limit - Optional limit for the number of results.
   * @param offset - Optional offset for pagination.
   * @returns A promise that resolves to an array of NameData.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async getNames(
    domain?: string,
    address?: string,
    text_records?: boolean,
    limit?: number,
    offset?: number,
  ): Promise<NameData[]> {
    const params = new URLSearchParams();
    if (domain) params.append("domain", domain);
    if (address) params.append("address", address);
    if (text_records !== undefined) params.append("text_records", text_records ? "1" : "0");
    if (limit !== undefined) params.append("limit", limit.toString());
    if (offset !== undefined) params.append("offset", offset.toString());

    const endpoint = `/get-names?${params.toString()}`;
    return this.request<NameData[]>(endpoint, "GET");
  }

  /**
   * Searches for names based on specified criteria.
   * @param domain - The domain to search in.
   * @param name - The name to search for.
   * @param text_records - Optional flag to include text records.
   * @param limit - Optional limit for the number of results.
   * @param exact_match - Optional flag for exact matching.
   * @param offset - Optional offset for pagination.
   * @returns A promise that resolves to an array of NameData.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async searchNames(
    domain: string,
    name: string,
    text_records?: boolean,
    limit?: number,
    exact_match?: boolean,
    offset?: number,
  ): Promise<NameData[]> {
    const params = new URLSearchParams({ domain, name });
    if (text_records !== undefined) params.append("text_records", text_records ? "1" : "0");
    if (limit !== undefined) params.append("limit", limit.toString());
    if (exact_match !== undefined) params.append("exact_match", exact_match ? "1" : "0");
    if (offset !== undefined) params.append("offset", offset.toString());

    const endpoint = `/search-names?${params.toString()}`;
    return this.request<NameData[]>(endpoint, "GET");
  }

  /**
   * Searches for a single name with exact matching.
   * @param domain - The domain to search in.
   * @param name - The name to search for.
   * @param text_records - Optional flag to include text records.
   * @returns A promise that resolves to a single NameData object.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   * @throws {MissingDataError} If no matching name is found.
   */
  async searchName(domain: string, name: string, text_records?: boolean): Promise<NameData> {
    const params = new URLSearchParams({ domain, name, limit: "1", exact_match: "1" });
    if (text_records !== undefined) params.append("text_records", text_records ? "1" : "0");

    const endpoint = `/search-names?${params.toString()}`;
    const data = await this.request<NameData[]>(endpoint, "GET");

    if (data.length === 0) {
      throw new MissingDataError(`No user found matching name: ${name}`);
    }
    return data[0];
  }

  /**
   * Deletes a name from the specified domain.
   * @param name - The name to delete.
   * @param domain - The domain from which to delete the name.
   * @returns A promise that resolves when the name is deleted.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async deleteName(name: string, domain: string): Promise<void> {
    const data = { name, domain };
    await this.request("/delete-name", "POST", data);
  }

  /**
   * Sets domain data.
   * @param domain - The domain to set.
   * @param address - The address associated with the domain.
   * @param contenthash - Optional content hash.
   * @param text_records - Optional text records.
   * @returns A promise that resolves when the domain is set.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async setDomain(
    domain: string,
    address: string,
    contenthash?: string,
    text_records?: TextRecords,
  ): Promise<void> {
    const data = { domain, address, contenthash, text_records };
    await this.request("/set-domain", "POST", data);
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

export default NameStone;
