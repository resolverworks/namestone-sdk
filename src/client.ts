import { AuthenticationError, MissingDataError, NetworkError } from "./errors";
import type { CoinTypes, DomainData, NameData, TextRecords } from "./types";

export class NameStone {
  private baseUrl = "https://namestone.xyz/api/public_v1";
  private headers: HeadersInit;

  constructor(apiKey: string) {
    this.headers = new Headers({
      "Content-Type": "application/json",
      Authorization: apiKey,
    });
  }

  private async request<T>(
    endpoint: string,
    method: string,
    data?: any
  ): Promise<T> {
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

  async setName(
    name: string,
    domain: string,
    address: string,
    contenthash?: string,
    text_records?: TextRecords,
    coin_types?: CoinTypes
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

  async claimName(
    name: string,
    domain: string,
    address: string,
    contenthash?: string,
    text_records?: TextRecords,
    single_claim?: boolean
  ): Promise<void> {
    const data = { name, domain, address, contenthash, text_records };
    const endpoint = `/claim-name${single_claim ? "?single_claim=1" : ""}`;
    await this.request(endpoint, "POST", data);
  }

  async getNames(
    domain?: string,
    address?: string,
    text_records?: boolean,
    limit?: number,
    offset?: number
  ): Promise<NameData[]> {
    const params = new URLSearchParams();
    if (domain) params.append("domain", domain);
    if (address) params.append("address", address);
    if (text_records !== undefined)
      params.append("text_records", text_records ? "1" : "0");
    if (limit !== undefined) params.append("limit", limit.toString());
    if (offset !== undefined) params.append("offset", offset.toString());

    const endpoint = `/get-names?${params.toString()}`;
    return this.request<NameData[]>(endpoint, "GET");
  }

  async searchNames(
    domain: string,
    name: string,
    text_records?: boolean,
    limit?: number,
    exact_match?: boolean,
    offset?: number
  ): Promise<NameData[]> {
    const params = new URLSearchParams({ domain, name });
    if (text_records !== undefined)
      params.append("text_records", text_records ? "1" : "0");
    if (limit !== undefined) params.append("limit", limit.toString());
    if (exact_match !== undefined)
      params.append("exact_match", exact_match ? "1" : "0");
    if (offset !== undefined) params.append("offset", offset.toString());

    const endpoint = `/search-names?${params.toString()}`;
    return this.request<NameData[]>(endpoint, "GET");
  }

  async deleteName(name: string, domain: string): Promise<void> {
    const data = { name, domain };
    await this.request("/delete-name", "POST", data);
  }

  async setDomain(
    domain: string,
    address: string,
    contenthash?: string,
    text_records?: TextRecords
  ): Promise<void> {
    const data = { domain, address, contenthash, text_records };
    await this.request("/set-domain", "POST", data);
  }

  async getDomain(domain?: string): Promise<DomainData[]> {
    const params = new URLSearchParams();
    if (domain) params.append("domain", domain);

    const endpoint = `/get-domain?${params.toString()}`;
    return this.request<DomainData[]>(endpoint, "GET");
  }
}

export default NameStone;
