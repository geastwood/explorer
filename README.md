# Vastchain explorer

## development

```bash
# what for any changes and recompile the html
fswatch -o templates ./index.ts providers | xargs -n 1 -I {} yarn release
```
> It requires **fswatch** to be installed

```bash
# start the dev server
yarn dev
```


