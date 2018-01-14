---
title: async/await的使用
date: 2017-12-23 14:16:23
categories: js什锦
tags: 分享
---
本文简单介绍`async`/`await`，主要结合一个图片上传的场景进行使用。
<!--more-->

有关`async`/`await`的出现，缘由可以跟随着`Generator -> Promise -> 回调函数噩梦(callback hell) -> 异步 -> 单线程的javascript`这样的js倒序发展，一直追溯到javascript的出生。这里面的故事多着，这里主要针对`async`/`await`的使用进行介绍。

# async/await
## 介绍
有关`async`/`await`的出现和原理这里不做详细解释，感兴趣的小伙伴们可以参考：

- [MDN | async](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN | await](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await)
- [《async 函数的含义和用法》](http://www.ruanyifeng.com/blog/2015/05/async.html)
- [《Generator 函数的含义与用法》](http://www.ruanyifeng.com/blog/2015/04/generator.html)

总之一句话总结：`async`函数就是`Generator`函数的语法糖。`async`函数的实现，就是将`Generator`函数和自动执行器，包装在一个函数里。

## 使用场景
同步的写代码方式的确会轻松的，加上如今`webpack`、`babel`等工具的普及，写代码可以是一件很舒服很享受的事情了。

常见的使用场景包括：
- 文件、图片的读取等待
- http请求的等待
- 串行http请求的处理

其实，在javascript中涉及到异步回调的处理，都可作为合适的使用场景。下面我们来针对一个图片的处理场景具体说明。


# 图片的上传和处理
## 场景
首先介绍一下需求场景：
1. 从编辑器插件中获取到用户上传的图片，为一组的`base64`数据，即`['base64-1', 'base64-1', ..., 'base64-n']`的数据。
2. 需要将每个`base64`通过接口上传到服务器，同时拿回一个图片`url`地址。
3. 获取每个图片的大小，通过参数的方式添加到`url`的尾部（别处需要用到该数据）。
4. 将最后的`['url-1?width=x&height=x', 'url-1?width=x&height=x', ..., 'url-n?width=x&height=x']`传给后台保存。

需要注意的地方是：
1. `await`操作符用于等待一个`Promise`对象，所以我们需要返回一个`Promise`对象用于等待。
2. `await`只能在异步函数`async function`中使用。

### 获取图片宽高
图片的加载是个异步的过程，我们来实现一个获取图片宽高的`Promise`：

``` js
// 获取图片宽高
function getImgSize(url) {
  // 返回一个Promise给await
  return new Promise((resolve, reject) => {
    const image = new Image();
    // 加载完成调用resolve
    image.onload = () => {
      resolve({
        width: image.width,
        height: image.height
      });
    };
    // 加载失败调用reject
    image.onerror = err => {
      reject(err);
    };
    // 添加src，触发加载
    image.src = url;
  });
}
```

这样，我们可以通过`await getImgSize(url)`的方式，来同步获取图片大小。

### 上传图片并添加宽高参数
同样的，上传图片ajax服务也是异步过程，同时需要判断该内容是否`base64`(编辑状态下，为已处理的`url`格式)。

``` js
// 上传图片
function uploadCdnImg(item) {
  const url = item.url;
  return new Promise((resolve, reject) => {
    if (url.indexOf("base64") > -1) {
      // 未处理的base64，上传cdn
      $.ajax(
        url: "imgstore/upload",
        param: {str_img_data: url.split(",")[1]}, 
        success: async ({ data }) => {
          // 同步获取宽高
          const imgSize = await getImgSize(url);
          // 添加到url尾部，并返回新的url和原本的数据信息
          const idnUrl = data.url + `?width=${imgSize.width}&height=${imgSize.height}`;
          resolve({...item, url: idnUrl});
        },
        error: (err) => {
          // 出错返回
          reject(err);
        }
      );
    } else {
      // 已处理的url，直接返回
      resolve(url);
    }
  })
}
```

### 并行处理多个图片
上面，我们已经完成了单个图片的上传+大小获取了。现在我们来做最后的一步，同时处理一组的图片：

``` js
async function uploadImageList(list) {
  // 每一个图片url转换成一个Promise
  const promises = list.map(x => uploadCdnImg(x.url));
  // 同步并行处理所有图片
  try {
    const results = await Promise.all(promises);
  } catch (error) {
    alert('图片上传失败')
    return
  }
  return results;
}
```

我们在使用`async`/`await`的时候，需要进行异常的捕获和处理，这里只做了最简单的处理。


## 结束语
-----
这里只介绍了简单的`async`/`await`使用，其他的像解构、`Promise`、拓展等，当习惯了这些语法糖之后，写码的幸福指数会有很大提升。