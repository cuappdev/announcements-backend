# announcements-backend

Backend for announcements.

## Getting Started

1. Duplicate the `.envtemplate` file and rename it to `.env`. Set `NODE_ENV` to either `local`, `development`, or `production`. Then, set `LOCAL_URI`, `DEV_URI` and `PROD_URI` to the MongoDB drvie connection URIs for all 3 environments.

- Note that in order to run the database locally, you will need to have MongoDB installed.

2. Run `yarn` to install dependencies.
3. Start the development server by running `yarn dev`. To run the production build instead, use `yarn build` followed by `yarn start`.

## Testing

1. Make sure dependencies are installed with `yarn`.
2. To run the test suite, use `yarn test`.

## Styling

- If using VSCode, install the Prettier extension and configure your settings to use it.
