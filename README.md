# announcements-backend

Backend for announcements.

## Getting Started

1. Duplicate the `.envtemplate` file and rename it to `.env`. Set `NODE_ENV` to either `local`, `development`, or `production`. Then, set `LOCAL_URI`, `DEV_URI` and `PROD_URI` to the MongoDB drvie connection URIs for all 3 environments.

- For AppDev members, the local `.env` file is pinned in the `#announcements-dev` channel.
- Note that in order to run the database locally, you will need to have MongoDB installed.

2. Run `yarn` to install dependencies.
3. Start the development server by running `yarn dev`. To run the production build instead, use `yarn build` followed by `yarn start`.

## Testing

### Jest

1. Make sure dependencies are installed with `yarn`.
2. To run the test suite, use `yarn test`.

### Postman

1. To generate an auth token, navigate to the [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/).
2. Go to settings in the top right, select **Use your own OAuth credentials** and pass in the Client ID and secret. These are pinned in the `#announcements-dev` channel.
3. For the scope, select **Google OAuth2 API v2**, check all 3 options, then click on **Authorize APIs**.
4. If prompted to log in, choose an account that you want to authenticate.
5. Click **Exchange authorization code for tokens**.
6. In the response body, copy the `id_token` field and use that as a **Bearer** token.

## Styling

- If using VSCode, install the Prettier extension and configure your settings to use it.
