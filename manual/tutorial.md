# Tutorial

### Content Providers

- `TODO:` write about the helper classes.

### KAT Providers

Content from [kat.cr](https://kat.cr/) is grabbed with so called `providers` which can be configured in the `./src/config/constants.js` file. Providers will be converted to a search query to [kat.cr](https://kat.cr/) so each provider can get a maximum of 10.000 torrents (or 400 pages or torrents). You can read more on how to make providers [here](https://github.com/chrisalderson/kat-api-pt).

**An example of a provider:**

```javascript
{
  name: "ZonerLOL",
  query: {
    query: "x264-LOL",
    min_seeds: 3
  }
}
```

### Folder structure

The API has the following folder structure.

```
.
└── src                  # Holding the ES6 source code
    ├── config           # Configuration
    ├── controllers      # REST Controllers
    ├── models           # Models
    └── providers        # Providers
        ├── movie        # Movie providers
        └── show         # Show providers
```

### Versioning

For transparency and insight into our release cycle, and for striving to maintain backward compatibility, this project will be maintained according to the [Semantic Versioning](http://semver.org/) guidelines as much as possible.

Releases will be numbered with the following format: `<major>.<minor>.<patch>-<build>`

Constructed with the following guidelines:

- A new _major_ release indicates a large change where backwards compatibility is broken.
- A new _minor_ release indicates a normal change that maintains backwards compatibility.
- A new _patch_ release indicates a bugfix or small change which does not affect compatibility.
- A new _build_ release indicates this is a pre-release of the version.
