# Create Sprites & SVG sprites

This is a wrapper for spritesheet & svgstore for creating sprites

It can be used however on it's own. To install run:

```bash
npm install @djforth/ap_sprites -g
```

Now add the configuration details to your package.json like so (N.B. These are the defaults):

```json
  "sprites": {
      "css": true,
      "cssout": "app/javascript/stylesheets/sprites",
      "input": "app/javascript/sprites",
      "output": "app/javascript/images/sprites",
      "ext": ["*.png", "*.gif"],
      "scss": true,
      "imageUrl": true,
      "rootPath": "images/sprites",
      "pngFolder": "pngs",
      "svgFolder": "svgs",
      "svgOutput": "app/assets/images"
  }

```
