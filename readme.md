# Hestica - Open Source Recipe Management
Host your own recipe management system with react native web app and Directus CMS.

<img src="./react-native/assets/hestica.png" width="300" height="340">

Derived from hestia: https://de.wikipedia.org/wiki/Hestia

**Features**:

- Simple, but beautiful recipe management
- Enter recipes either via mobile web app or by using Directus CMS.
- Manage ingredients
- Multi-user support
- Soon: Filter
- Soon: Tags

**Under active development, use with care!**

## Getting started (currently only for development)
First, adjust the values in the `.env` file by copying `.env.default`:
```
cp .env.default .env
```

Start the containers with:

```
docker compose up -d
```

Then, visit directus on http://localhost:8055
and login with the provided credentials in the .env file. The token will be created in a later step.

*Hint*: If nothing shows up, you might need to restart directus as the database was created during the first start of the database container and directus might therefore fail on the first start:

```
docker compose up directus -d --force-recreate
```

Next, create an access token for the administor in the web interface of directus and enter it in the `.env` file. Restart the app container

```
docker compose up app -d --force-recreate
```

### Create directus schema and permissions
Login to the container and upload the schema and the permissions:

```
docker compose exec app bash
cd ../directus/scripts
yarn install
yarn run schema-upload
yarn run permissions-upload
```

Start the web app:

```
docker compose exec app bash
yarn run web
```

Thats it! Directus is configured and the app server has started. Visit the app on http://localhost:8081/

## Development

### Linting
```
npx expo lint
npx prettier . --write
```

### Development with Directus

To update and build extensions, enter the directus folder:

```
cd ../directus/extensions/directus-extension-endpoint-recipe-add-image
yarn run dev
```

#### Generate types
Get a local access token first, and execute in the app container:

```
npx openapi-typescript http://directus:8055/server/specs/oas?access_token=YOUR_TOKEN -o ./lib/schema.d.ts
```

#### Download new permissions and user roles

```
docker compose exec app bash
cd ../directus/scripts
yarn install
yarn run schema-download
yarn run permissions-download
```

## Configurations

### Configurable env variables
`EXTENSION_MAX_PAYLOAD_SIZE` in mb
