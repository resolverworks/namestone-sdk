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
  coin_types?: CoinTypes;
  single_claim?: number;
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
interface GetDomainParams {
  domain: string;
}

interface GetSiweMessageParams {
  address: string;
  domain?: string;
  uri?: string;
}

interface EnableDomainParams {
  company_name: string;
  email: string;
  address: string;
  domain: string;
  signature: string;
  api_key?: string;
  cycle_key?: "0" | "1";
}

interface EnableDomainResponse {
  api_key: string;
}

class NameStone {
  private baseUrl = "https://namestone.xyz/api/public_v1";
  private headers: Record<string, string>;

  /**
   * Creates a NameStone instance.
   * @param apiKey - NameStone API key for authentication.
   */
  constructor(apiKey?: string) {
    this.headers = {
      "Content-Type": "application/json",
    };

    if (apiKey) {
      this.headers["Authorization"] = apiKey;
    }
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
      const errorMessage = await res.text();
      if (res.status === 401) {
        throw new AuthenticationError(`Authentication failed: ${errorMessage}`);
      }
      throw new NetworkError(`HTTP error! status: ${res.status}, message: ${errorMessage}`);
    }

    return res.json();
  }
  private async requestText(endpoint: string): Promise<string> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      method: "GET",
      headers: {
        Accept: "text/plain",
      },
    };

    const res = await fetch(url, config);

    if (!res.ok) {
      const errorMessage = await res.text();
      throw new NetworkError(`HTTP error! status: ${res.status}, message: ${errorMessage}`);
    }

    return res.text();
  }
  /**
   * Helper method to check if API key is present for authenticated endpoints
   * @throws {AuthenticationError} If API key is not provided
   */
  private checkApiKey(): void {
    if (!this.headers["Authorization"]) {
      throw new AuthenticationError("API key is required for this endpoint");
    }
  }

  /**
   * Sets a name with associated data.
   * @param params - The parameters for setting a name.
   * @returns A promise that resolves when the name is set.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async setName(params: SetNameParams): Promise<void> {
    this.checkApiKey();
    return await this.request("/set-name", "POST", params);
  }

  /**
   * Claims a name with associated data.
   * @param params - The parameters for claiming a name.
   * @returns A promise that resolves when the name is claimed.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async claimName(params: ClaimNameParams): Promise<void> {
    this.checkApiKey();
    const single_claim = params.single_claim || 0;
    const queryParams = new URLSearchParams();
    queryParams.append("single_claim", single_claim.toString());
    const endpoint = `/claim-name?${queryParams}`;
    return await this.request(endpoint, "POST", params);
  }

  /**
   * Retrieves names based on specified criteria.
   * @param params - The parameters for retrieving names.
   * @returns A promise that resolves to an array of NameData.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async getNames(params: GetNamesParams): Promise<NameData[]> {
    this.checkApiKey();
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
    this.checkApiKey();
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
    this.checkApiKey();
    return await this.request("/delete-name", "POST", params);
  }

  /**
   * Sets domain data.
   * @param params - The parameters for setting a domain.
   * @returns A promise that resolves when the domain is set.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async setDomain(params: SetDomainParams): Promise<void> {
    this.checkApiKey();
    return await this.request("/set-domain", "POST", params);
  }

  /**
   * Retrieves domain data.
   * @param domain - Optional domain to retrieve data for.
   * @returns A promise that resolves to an array of DomainData.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async getDomain(params: GetDomainParams): Promise<DomainData[]> {
    this.checkApiKey();
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    }
    const endpoint = `/get-domain?${queryParams.toString()}`;
    return this.request<DomainData[]>(endpoint, "GET");
  }
  async getSiweMessage(params: GetSiweMessageParams): Promise<string> {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    }
    const endpoint = `/get-siwe-message?${queryParams.toString()}`;
    return this.requestText(endpoint);
  }
  /**
   * Enables a new domain for NameStone and returns an API key.
   * Note: Domain resolver must be NameStone's resolver: 0xA87361C4E58B619c390f469B9E6F27d759715125
   * @param params - The parameters for enabling a domain.
   * @returns A promise that resolves to the API key response.
   * @throws {AuthenticationError} If authentication fails.
   * @throws {NetworkError} If there's a network error.
   */
  async enableDomain(params: EnableDomainParams): Promise<EnableDomainResponse> {
    return this.request<EnableDomainResponse>("/enable-domain", "POST", params);
  }
}
export = NameStone;
