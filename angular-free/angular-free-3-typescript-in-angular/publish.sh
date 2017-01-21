#/bin/bash

# clean app/entry
rm -rf app/entry

# webpack build
webpack --config webpack.config.js

# clean build
rm -rf build
mkdir build

# copy to build
cp -r app/entry build/entry
cp -r app/gentelella build/gentelella
cp -r app/modules build/modules
find build/modules -name '*.ts' -exec rm '{}' ';'
cp app/index.html build/index.html
# cp app/config.json build/config.json

# generate zip file
# zip -r build.zip build

# clean up build
# rm -rf build