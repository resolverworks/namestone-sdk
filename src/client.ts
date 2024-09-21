import { AuthenticationError, MissingDataError, NetworkError } from "./errors";
import type { NameStoneResponse, NameStoneUser } from "./types";

class NameStone {
  baseURL = "https://namestone.xyz/api/public_v1/";
  headers: Headers;
  domain: string;

  constructor(domain: string, apiKey: string) {
    this.domain = domain;
    this.headers = new Headers({
      "Content-Type": "application/json",
      Authorization: apiKey,
    });
  }

  async #get<T>(
    path: "get-names" | "search-names" | "get-domain",
    queryParams: string
  ): Promise<T> {
    const url = `${this.baseURL}${path}?domain=${this.domain}&${queryParams}`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.headers,
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new AuthenticationError("Authentication failed");
      }
      throw new NetworkError(`HTTP error! status: ${res.status}`);
    }

    return res.json() as Promise<T>;
  }

  async #post<TReturn, TBody>(
    path: "set-name" | "claim-name" | "delete-name" | "set-domain",
    body: TBody
  ): Promise<TReturn> {
    const url = this.baseURL + path;
    const res = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new AuthenticationError("Authentication failed");
      }
      throw new NetworkError(`HTTP error! status: ${res.status}`);
    }

    return res.json() as Promise<TReturn>;
  }

  /** POST to "Set Name" */
  async setName(name: string, address: string): Promise<any> {
    const body = {
      domain: this.domain,
      name,
      address,
      text_records: {},
    } satisfies NameStoneUser;
    return this.#post<any, NameStoneUser>("set-name", body);
  }

  /** POST to "Claim Name" */
  async claimName(name: string, address: string): Promise<any> {
    const body = {
      domain: this.domain,
      name,
      address,
      text_records: {},
    } satisfies NameStoneUser;
    return this.#post<any, NameStoneUser>("claim-name", body);
  }

  /** GET - any names */
  async getNames(limit: number): Promise<NameStoneResponse> {
    const queryParams = `limit=${limit}`;
    const data = await this.#get<NameStoneResponse>("get-names", queryParams);
    return data;
  }

  /** GET - one name */
  async getName(address: string): Promise<NameStoneUser> {
    const queryParams = `address=${address}&limit=1`;
    const data = await this.#get<NameStoneResponse>("get-names", queryParams);
    return data[0];
  }

  /** GET - names from a query */
  async searchNames(query: string, limit: number): Promise<NameStoneResponse> {
    const queryParams = `name=${query}&limit=${limit}`;
    const data = await this.#get<NameStoneResponse>(
      "search-names",
      queryParams
    );
    return data;
  }

  /** GET - one name from a query */
  async searchName(name: string): Promise<NameStoneUser> {
    const queryParams = `name=${name}&limit=1`;
    const data = await this.#get<NameStoneResponse>(
      "search-names",
      queryParams
    );

    if (data.length === 0 || data[0].name !== name) {
      throw new MissingDataError(`No user found matching name: ${name}`);
    }

    return data[0];
  }

  /** POST to "Delete Name" */
  async deleteName(name: string) {
    const body = {
      domain: this.domain,
      name,
    } satisfies Partial<NameStoneUser>;
    return await this.#post<any, Partial<NameStoneUser>>("delete-name", body);
  }
}

export default NameStone;
