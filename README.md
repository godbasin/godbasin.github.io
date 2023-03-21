# Pacman

Pacman is a flat and responsive design theme for [Hexo](http://hexo.io).

[Demo](http://A-limon.github.io/pacman) || [Alimon's Blog](http://yangjian.me)

中文说明请访问[这里](http://A-limon.github.io/pacman/hello/introducing-pacman-theme/)
##Installation
###Install
```
$ git clone https://github.com/A-limon/pacman.git themes/pacman
```
**Pacman requires Hexo 2.4.5 and above.** 
###Enable
Modify `theme` setting in blog folder` _config.yml` to `pacman`.
###Update
```
cd themes/pacman
git pull
```
**please backup your `_config.yml` file before update.** 
##Configuration

Modify settings in  `/themes/pacman/_config.yml`.

```
##### Menu
menu:
  Home: /
  Archives: /archives
## you can create `tags` and `categories` folders in `../source`.
## And create a `index.md` file in each of them.
## set `front-matter`as
## layout: tags (or categories)
## title: tags (or categories)
## ---

#### Widgets
widgets: 
- category
- tag
- rss
## provide six widgets:category,tag,rss,archive,tagcloud,links.
## modify links in `/layout/_widget/links.ejs`.

#### RSS
rss: ## RSS address.

#### Image
imglogo:
  enable: true             ## display image logo true/false.
  src: img/logo.svg        ## `.svg` and `.png` are recommended,please put image into the theme folder `/pacman/source/img`.
favicon: img/favicon.ico   ## size:16px*16px,`.ico` is recommended,please put image into the theme folder `/pacman/source/img`.     
apple_icon: img/pacman.jpg ## size:64px*64px,please put image into the theme folder `/pacman/source/img`.

#### Author Avatar Picture
author_img_enable: true ## display author avatar picture
dataURI: false
## if the picture's format is dataURI please set the value to true,otherwise set the value to false.
## convert an image into base 64 data URIs http://websemantics.co.uk/online_tools/image_to_data_uri_convertor/ .
author_img_data: ''
## paste the dataURI in ONE LINE and included it by ''.
author_img: img/author.jpg ## size:220px*220px.
## if the picture's format is `.png` or `.jpg`  instead of dataURI,you should set the `dataURI` value to false.

#### Font
ShowCustomFont: true  
## you can change custom font in `variable.styl` and `font.styl` which in the theme folder `/pacman/source/css`.

#### Toc
toc:
  article: true   ## show contents in article.
  aside: true     ## show contents in aside.
## you can set both of the value to true of neither of them.
## if you don't want display contents in a specified post,you can modify `front-matter` and add `toc: false`.

#### Fancybox
fancybox: false 
## if you use gallery post or want use fancybox please set the value to true.
## if you want use fancybox in ANY post please copy the file `fancybox.js`.
## in theme folder `/pacman/scripts` to your hexo blog folder `../scritps`.

#### Author information
author:
  google_plus:    ## eg:116338260303228776998 for https://plus.google.com/u/0/116338260303228776998
  intro_line1: "" ## eg: "Hello ,I'm Larry Page in Google."
  intro_line2: "" ## eg: "This is my blog,believe it or not."
  weibo:      ## e.g. 436062867 for http://weibo.com/436062867
  twitter:    ## e.g. yangjiansky for https://twitter.com/yangjiansky
  github:     ## e.g. A-limon for https://github.com/A-limon
  facebook:   ## e.g. yangjian for https://favebook.com/yangjian
  tsina:      ## e.g. 1664838973  Your weibo ID,It will be used in share button.

#### Comment
duoshuo: 
  enable: false  ## duoshuo.com
  short_name:    ## duoshuo short name.

#### Share button
jiathis:
  enable: false ## if you use jiathis as your share tool,the built-in share tool won't be display.
  id:    ## e.g. 1501277 your jiathis ID. 
  tsina: ## e.g. 1664838973 Your weibo id,It will be used in share button.

#### Analytics
google_analytics:
  enable: false
  id:   ## e.g. UA-1766729-8 your google analytics ID.
  site: ## e.g. yangjian.me your google analytics site or set the value as auto.
## You MUST upgrade to Universal Analytics first!
## https://developers.google.com/analytics/devguides/collection/upgrade/?hl=zh_CN

#### Custom Search
google_cse: 
  enable: false
  cx:  ## e.g. 000561263943549425496:mrzrm0gr4kg your Custom Search ID.
## https://www.google.com/cse/
```




[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/A-limon/pacman/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

