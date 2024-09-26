# NameStone SDK

Unofficial type-safe SDK for the namestone.xyz ENS subdomain API. See the official NameStone docs [here](https://namestone.xyz/docs/claim-name).

## Get Started

Initialize your NameStone client.

```typescript
import NameStone from "namestone-sdk";

const ns = new NameStone(<YOUR_API_KEY_HERE>);
```

Then call with the relevant methods.

```typescript
async function getData() {
  const data = await ns.getNames();
  console.log(data);
}
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

### `claimName`

Claims a name with associated data. Maps to the NameStone '/claim-name' route.

- `name`: The name to claim.
- `domain`: The domain for the name.
- `address`: The address associated with the name.
- `contenthash`: Optional content hash.
- `text_records`: Optional text records.
- `single_claim`: Optional flag for single claim.

**Returns**: A promise that resolves when the name is claimed.

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

### `searchName`

Searches for a single name with exact matching. Maps to the NameStone '/search-names' route.

- `domain`: The domain to search in.
- `name`: The name to search for.
- `text_records`: Optional flag to include text records.

**Returns**: A promise that resolves to a single NameData object.

**Throws**: 
- `AuthenticationError`: If authentication fails.
- `NetworkError`: If there's a network error.
- `MissingDataError`: If no matching name is found.

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

## Worklog

- [ ] Improved error handling
