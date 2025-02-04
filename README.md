# Bendy Arrows

<div align="center">
  <img src="https://raw.githubusercontent.com/francisashley/bendy-arrows/main/logo.png" alt="Logo" style="max-width: 400px;">
  <br/>
  <em>Display an arrow between two html elements on the page</em>
  <br/>
  <a href="https://francisashley.github.io/bendy-arrows/">Documentation</a>
</div>

## Install

```bash
npm install bendy-arrows
# or
yarn add bendy-arrows
```

## Basic Usage

```ts
import { createArrows } from 'bendy-arrows'

const arrows = createArrows()

arrows.setConnections([{ source: 'first-element-id', target: 'second-element-id' }])
```

## License

MIT
