---
layout: default
title: SHA-384 Digest
description: Generate a SHA-384 Digest
handler: crypto.subtle.digest('SHA-384', new TextEncoder().encode(value)).then(hashBuffer => Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join(''))
---


This tool generates a [SHA-384 ⎋](https://en.wikipedia.org/wiki/SHA-2) digest.  Check out the [other tools](/).
