This is the demo app to register and login user, and sending ETHs with MetaMask

## Installing dependencies

```bash
npm install
```

## Running the project

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Metamask extension should be installed beforehand

## Running tests

### Setting test environment variables

```json
{
  "base_url": "http://localhost:3000",
  "wallet_private_key": "034e3...",
  "dest_public_address": "0x60..."
}
```

### Running Cypres tests

```bash
npm run cypress:run
```

