# Scrub Bower utility

If you are obsessive and compulsive about removing [Bower](https://github.com/bower/bower)-installed files that aren't needed or used.

## Installation:

```bash
npm install -g scrub-bower
```

## Usage:

In your `bower.json` file, append a key like so:

```json
"dependenciesIgnore": {
  "jquery": ["**/!(jquery.min.js)"],
  "mithril": ["**/!(mithril.min.js)"],
  "sugar": ["**/!(sugar.min.js)"],
  "tinymce": ["**/!(*.min.js|*.min.css|*.eot|*.svg|*.ttf|*.woff|*.gif)", "**/*jquery*", "plugins/!(advlist|autolink|lists|link|image|charmap|hr|anchor|searchreplace|wordcount|visualblocks|visualchars|code|fullscreen|media|save|table|contextmenu|directionality|paste|textcolor|colorpicker|textpattern|imagetools)/**/*"]
}
```

Refer to [glob](http://www.npmjs.com/package/glob) documentation for match pattern syntax.

Then, from the cwd of your `bower.json` file, run this script like so:

```bash
scrub-bower --dry # see what it will delete
scrub-bower # actually delete it
bower install --force # recover original files
```
