# CastBoard Counter Example

Counter is an official CastBoard example plugin. It is a small, dependency-free project intended to demonstrate the CastBoard plugin contract; it is not a project template.

## What it demonstrates

- a navigable full-screen plugin with a responsive Shadow DOM interface;
- all CastBoard lifecycle hooks: `mount`, `activate`, `deactivate`, `onResize`, `onConfigChange`, and `unmount`;
- namespaced persistence through `context.storage`;
- live configuration through `configSchema` and `context.config`;
- host-language selection through `context.i18n`.

The counter value survives plugin remounts. The configured step, details visibility, and accent color are applied immediately without reloading the plugin.

## Install a release package

Download `castboard-plugin-counter-<version>.zip` from [GitHub Releases](https://github.com/CoLinkDev/castboard-plugin-counter/releases). CastBoard plugins run as trusted code, so install packages only from sources you trust.

### CoLink Desktop

1. Open the CastBoard page in CoLink Desktop.
2. In **Plugin management**, choose **Import plugin**.
3. Select the downloaded ZIP package.

### CoLink Android

1. Open the CastBoard screen in CoLink Android.
2. In **Plugin management**, choose **Import plugin**.
3. Select the downloaded ZIP package.

## Local development

Clone this repository directly into the CastBoard development plugin directory:

```text
colink-castboard/src/plugins/dev/castboard-plugin-counter/
```

From the `colink-castboard` repository, install its development dependencies and start Vite:

```sh
pnpm install
pnpm dev
```

Open the URL printed by Vite with the `debug` query parameter, for example `http://localhost:5173/?debug`. CastBoard discovers the plugin from its `manifest.json`; no linking or copying step is required.

## Package

Node.js 22 is the only requirement:

```sh
node scripts/package.mjs
```

The script creates `dist/castboard-plugin-counter-<version>.zip`. The archive contains `manifest.json` and `index.js` at its root so it can be imported by CoLink Desktop and CoLink Android.

Pushing a tag matching the manifest version, such as `v1.0.0`, runs the same packaging script and publishes the ZIP in a GitHub Release.

## License

Licensed under the GNU Affero General Public License v3.0. See [LICENSE](LICENSE).
