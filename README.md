# Asset Pipeline - Sprites

This is a wrapper for spritesheet that will eventually become a plugin for a larger project to manage the whole build process.

It can be used however on it's own.  To install run:

```bash
npm install @djforth/ap_sprites -g
```


Now add the configuration details to your package.json like so (N.B. These are the defaults):

```json
"assets": {
    "sprites": {
      "input": "app/assets_uncompiled/sprites",
      "output": "app/assets_uncompiled/images/sprites",
      "cssout": "app/assets_uncompiled/stylesheets/sprites",
      "css":true,
      "scss":true,
      "image_url":true,
      "root_path":"sprites",
      "ext": [
        "*.png",
        "*.gif"
      ]
    }
  }

```