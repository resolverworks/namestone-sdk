# NameStone SDK

Type-safe SDK for interacting with the [NameStone](https://namestone.xyz/docs/) ENS subdomain API.

## Installation

```bash
npm install namestone-sdk
```

## Quick Start

```typescript
import NameStone from "namestone-sdk";

// Initialize the client (API key optional for some methods)
const ns = new NameStone("YOUR_API_KEY");

// Example usage
async function getSubdomains() {
  const data = await ns.getNames({
    domain: "example.eth",
  });
  console.log(data);
}
```

## API Reference

### Authentication Methods

#### `getSiweMessage`

Generate a Sign-In with Ethereum (SIWE) message for authentication. Does not require an API key. Maps to the NameStone '/get-siwe-message' route.

```typescript
const message = await ns.getSiweMessage({
  address: string,      // Your Ethereum address (must own the domain)
  domain?: string,      // Optional: Domain sending SIWE message (default: namestone.xyz)
  uri?: string         // Optional: URI sending SIWE message
});
```

#### `enableDomain`

Enable new domains for NameStone usage. Requires a signed SIWE message. Does not require an API key. Maps to the NameStone '/enable-domain' route.

```typescript
const result = await ns.enableDomain({
  company_name: string,  // Your company name
  email: string,         // Email for API key delivery
  address: string,       // Domain owner's Ethereum address
  domain: string,        // Domain to enable (e.g., "brand.eth")
  signature: string,     // Signed SIWE message
  api_key?: string,      // Optional: Existing API key
  cycle_key?: "1"       // Optional: Set to "1" to cycle existing key
});
```

### Domain Management

#### `setDomain`

Sets a domain with associated data. Maps to the NameStone '/set-domain' route.

```typescript
await ns.setDomain({
  domain: string,           // Domain to configure
  address: string,          // Associated address
  contenthash?: string,     // Optional: Content hash
  text_records?: Record<string, string>  // Optional: Text records
});
```

#### `getDomain`

Retrieves domain data. Maps to the NameStone '/get-domain' route.

```typescript
const domain = await ns.getDomain({
  domain: string, // Domain to query
});
```

### Subdomain Management

#### `setName`

Sets a name with associated data. Maps to the NameStone '/set-name' route.

```typescript
await ns.setName({
  name: string,             // Subdomain name
  domain: string,           // Parent domain
  address: string,          // Associated address
  contenthash?: string,     // Optional: Content hash
  text_records?: Record<string, string>,  // Optional: Text records
  coin_types?: Record<string, string>     // Optional: Coin types
});
```

#### `getNames`

Retrieves names based on specified criteria. Maps to the NameStone '/get-names' route.

```typescript
const names = await ns.getNames({
  domain?: string,          // Optional: Filter by domain
  address?: string,         // Optional: Filter by address
  text_records?: boolean,   // Optional: Include text records
  limit?: number,           // Optional: Results limit
  offset?: number          // Optional: Pagination offset
});
```

#### `searchNames`

Searches for names based on specified criteria. Maps to the NameStone '/search-names' route.

```typescript
const results = await ns.searchNames({
  domain: string,           // Domain to search within
  name: string,             // Search query
  text_records?: boolean,   // Optional: Include text records
  limit?: number,           // Optional: Results limit
  exact_match?: boolean,    // Optional: Require exact matches
  offset?: number          // Optional: Pagination offset
});
```

#### `deleteName`

Deletes a name from the specified domain. Maps to the NameStone '/delete-name' route.

```typescript
await ns.deleteName({
  name: string, // Subdomain to delete
  domain: string, // Parent domain
});
```

## Error Handling

All methods may throw:

- `AuthenticationError`: When API key is invalid or missing
- `NetworkError`: When API requests fails

## Todo

- [ ] Improve error handling
