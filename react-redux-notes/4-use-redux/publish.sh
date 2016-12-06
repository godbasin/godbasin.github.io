# clean dist
rm -rf dist

# webpack build
npm run build

# copy static
cp -r app/static dist
cp app/config.json dist/config.json

# generate zip file
# zip -r dist.zip dist

# clean up build
# rm -rf dist
