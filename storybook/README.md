# Verdocs Web SDK Storybook

This sub-project provides a simple Storybook-driven catalog to view
documentation and examples for components in the Verdocs Web SDK.
The components themselves are developed and built in StencilJS in
the `../verdocs-web-sdk` subdirectory.

A typical development workflow would be as follows:

1. In `../verdocs-web-sdk`, run `npm i` and then `npm start` to
   start a development server that watches the project and automatically
   rebuilds it when components change.
2. In another terminal, run `npm i` and then `npm run storybook` in this
   folder to watch for and rebuild any changes in the parent project as well
   as story edits here.

If you'd like to run the migrations again, you can do so by running 'npx storybook automigrate'≥


## Major Version Upgrades
Because `storybook` heavily relies on other packages/addons, upgrading to a new major version can get a little tricky. Changing the version(s) manually in `werdocs-web-sdk-storybook/package.json` dependencies will likely become mismatched, and will result in mysterious error messages in the console.

All hope is not lost! Storybook provides tools to help make the migration process easier:

```sh
# Step #1 - Attemot an automatic upgrade via:
npx storybook@latest upgrade

# Step #2 - If that didn't work, you need to continue diagnostics. Run:
npx storybook doctor

# The storybook doctor will let you know which dependencies are not matching and
# which steps to take. Always look out for these sort of `doctor`
# tools, as they come in handy 👍 (see `expo`).
```