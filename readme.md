# Hestica - Open Source Recipe Management
Host your own recipe management system with react native web app and CMS.

<img src="./react-native/assets/hestica.png" width="300" height="340">

Derived from hestia: https://de.wikipedia.org/wiki/Hestia

## Installation
First, adjust the values in the .env file by copying .env.default:
```
cp .env.default .env
```

Then start the containers with:

```
docker compose up -d
```

Then, visit directus on http://localhost:8055
and login with the provided credentials in the .env file.

Next, create an access token for the administor and enter it in the .env file. Restart the app container

```
docker compose up app -d --force-recreate
```

### Create directus schema and permissions
Login to the container and upload the schema:
```
docker compose exec app bash
cd ../directus/scripts
yarn install
yarn run schema-upload
yarn run permissions-upload
```

Thats it! Visit the app on http://localhost:8081/
## Development with Directus
### Env
`EXTENSION_MAX_PAYLOAD_SIZE` in mb

## Buiding extensions
```
cd directus/extensions/directus-extension-custom-file
yarn run dev
```

### Types generate
Get a local access token first
```
npx openapi-typescript http://directus:8055/server/specs/oas?access_token= -o ./lib/schema.d.ts
```

OR

```
npx directus-typescript-gen --host http://localhost:8055 --email ADMIN_EMAIL --password ADMIN_PASSWORD --typeName ApiCollections --outFile api-collection.d.ts
```

### Linting
```
npx expo lint
npx prettier --write
```

### Directus Extension Development
```
yarn run build --watch
```

Use env var `EXTENSIONS_AUTO_RELOAD` to auto reload extensions.