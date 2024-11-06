# NameStone SDK

Unofficial type-safe SDK for the namestone.xyz ENS subdomain API. See the official NameStone docs [here](https://namestone.xyz/docs/).

## Get Started

Initialize your NameStone client. API key is not required for getSiweMessage or enableDomain.

```typescript
import NameStone from "namestone-sdk";

const ns = new NameStone(<YOUR_API_KEY_HERE>);
```

Then call with the relevant methods. Wrap all params in an object

```typescript
async function getData() {
  const domain = "testbrand.eth";
  const data = await ns.getNames({ domain: domain });
  console.log(data);
}

getData();
```

## Documentation

### `setName`

Sets a name with associated data. Maps to the NameStone '/set-name' route.

- `name`: The name to set.
- `domain`: The domain for the name.
- `address`: The address associated with the name.
- `contenthash`: Optional content hash.
- `text_records`: Optional text records.
- `coin_types`: Optional coin types.

**Returns**: A promise that resolves when the name is set.

**Throws**:

- `AuthenticationError`: If authentication fails.
- `NetworkError`: If there's a network error.

<br>

### `getNames`

Retrieves names based on specified criteria. Maps to the NameStone '/get-names' route.

- `domain`: Optional domain to filter names.
- `address`: Optional address to filter names.
- `text_records`: Optional flag to include text records.
- `limit`: Optional limit for the number of results.
- `offset`: Optional offset for pagination.

**Returns**: A promise that resolves to an array of NameData.

**Throws**:

- `AuthenticationError`: If authentication fails.
- `NetworkError`: If there's a network error.

<br>

### `searchNames`

Searches for names based on specified criteria. Maps to the NameStone '/search-names' route.

- `domain`: The domain to search in.
- `name`: The name to search for.
- `text_records`: Optional flag to include text records.
- `limit`: Optional limit for the number of results.
- `exact_match`: Optional flag for exact matching.
- `offset`: Optional offset for pagination.

**Returns**: A promise that resolves to an array of NameData.

**Throws**:

- `AuthenticationError`: If authentication fails.
- `NetworkError`: If there's a network error.

<br>

### `deleteName`

Deletes a name from the specified domain. Maps to the NameStone '/delete-name' route.

- `name`: The name to delete.
- `domain`: The domain from which to delete the name.

**Returns**: A promise that resolves when the name is deleted.

**Throws**:

- `AuthenticationError`: If authentication fails.
- `NetworkError`: If there's a network error.

<br>

### `setDomain`

Sets domain data. Maps to the NameStone '/set-domain' route.

- `domain`: The domain to set.
- `address`: The address associated with the domain.
- `contenthash`: Optional content hash.
- `text_records`: Optional text records.

**Returns**: A promise that resolves when the domain is set.

**Throws**:

- `AuthenticationError`: If authentication fails.
- `NetworkError`: If there's a network error.

<br>

### `getDomain`

Retrieves domain data. Maps to the NameStone '/get-domain' route.

- `domain`: Optional domain to retrieve data for.

**Returns**: A promise that resolves to an array of DomainData.

**Throws**:

- `AuthenticationError`: If authentication fails.
- `NetworkError`: If there's a network error.

<br>

### `getSiweMessage`

Retrieves a SIWE (Sign-In with Ethereum) message for authentication. Maps to the NameStone '/get-siwe-message' route. Does not require an API key.

- `address`: Your Ethereum address. This address should own the domain you plan to use with NameStone.
- `domain`: Optional domain sending the SIWE message. Defaults to namestone.xyz.
- `uri`: Optional URI sending the SIWE message. Defaults to "https://namestone.xyz/api/public_v1/get-siwe-message"
  **Returns**: A promise that resolves to a SIWE message string.
  **Throws**:
- `NetworkError`: If there's a network error.
  <br>

### `enableDomain`

Programmatically enables new domains for NameStone. Maps to the NameStone '/enable-domain' route. Requires a signed SIWE message. Does not require an API key.

- `company_name`: The name of your company.
- `email`: Your email to send the api key to.
- `address`: The Ethereum address that owns the domain.
- `domain`: The domain (e.g. "testbrand.eth").
- `signature`: The message from get-siwe-message, signed with your Ethereum address.
- `api_key`: Optional. To use an existing NameStone API key that your wallet has access to.
- `cycle_key`: Optional. If "1" and the api key already exists, the key will be cycled.
  **Returns**: A promise that resolves to an object containing the new API key.
  **Throws**:
- NetworkError: If there's a network error.
  <br>

## Worklog

- [ ] Improved error handling
