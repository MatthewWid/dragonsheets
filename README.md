# Dragonsheets

Online shopping platform for [Dungeons & Dragons](https://www.dndbeyond.com/) character sheets.

A demo project to learn payment integrations with [Stripe](https://stripe.com/) and authentication with [OpenID Connect](https://openid.net/developers/how-connect-works/).

## Technologies

### Shared

* [TypeScript](https://www.typescriptlang.org/) for type-checking
* [Prettier](https://prettier.io/) for formatting
* [ESLint](https://eslint.org/) for linting
* [pnpm](https://pnpm.io/) for dependency and monorepo management

### Front-end

* [Vite](https://vite.dev/) for building
* [React](https://react.dev/) for the user interface
* [Mantine](https://mantine.dev/) for pre-built components
* [React Query](https://tanstack.com/query/latest) for data caching
* [ky](https://github.com/sindresorhus/ky) for data fetching
* [TanStack Router](https://tanstack.com/router/latest) for routing

### Back-end

* [Node.js](https://nodejs.org/en) for the runtime
* [NestJS](https://nestjs.com/) + [Express](https://expressjs.com/) for the web-server framework
* [Keycloak](https://www.keycloak.org/) + [OpenID Connect](https://openid.net/developers/how-connect-works/) for authentication
* [Stripe](https://docs.stripe.com/) for payment processing

## Development

Install Node, pnpm and dependences:

```sh
curl -L https://git.io/n-install | bash
n auto
npm i -g pnpm
pnpm i
```

Create an environment variables file:

```sh
cp ./packages/api/.env.template ./packages/api/.env
```

[Create an account on Stripe](https://dashboard.stripe.com/register), [enable test mode](https://docs.stripe.com/test-mode), then for each asset in `./packages/api/src/assets` [create a product](https://docs.stripe.com/products-prices/getting-started) with a title, description and price and then copy its product ID to the corresponding entry in `./packages/api/src/config/constants.config.ts`.

[Copy your Stripe API key](https://docs.stripe.com/keys#reveal-an-api-secret-key-for-test-mode) to the `STRIPE_SECRET_KEY` variable in `./packages/api/.env`.

Run Keycloak:

```sh
cd ./packages/api
docker compose up -d
```

[Open Keycloak](http://localhost:8080) and [create a new realm](https://www.keycloak.org/docs/latest/server_admin/index.html#proc-creating-a-realm_server_administration_guide) named `dragonsheets`. Under `Realm settings` -> `Login` -> `Login screen customization` enable `User registration` and `Remember me`.

[Create an OpenID Connect client](https://www.keycloak.org/docs/latest/server_admin/index.html#proc-creating-oidc-client_server_administration_guide) with client ID `dragonsheets-webapi`, only the `Standard flow` option enabled and `Client authentication` option set to `ON`. Set `Valid redirect URIs` to `http://localhost:5173/auth/login-success`, `Valid post logout redirect URIs` to `http://localhost:5173/auth/logout-success` and `Web origins` to `http://localhost:5173`.

Copy the client secret to the `AUTH_OIDC_CLIENT_SECRET` variable in `./packages/api/.env`.

Run the front-end web UI and back-end API in development mode:

```sh
pnpm run --filter web --filter api dev
```

## License

This project is licensed under the [MIT license](https://opensource.org/license/mit/).
