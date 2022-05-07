---
layout: default
title: Base64 Encoder
description: Tool encodes a given string using Base64.
scripts:
  - https://unpkg.com/json5@^2.0.0/dist/index.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js
handler: jsyaml.dump(JSON5.parse(value))
---

This tool converts [JSON ⎋](https://www.json.org/json-en.html) to [YAML ⎋](https://yaml.org/).
  Check out the [YAML to JSON Converter](yaml-to-json).
