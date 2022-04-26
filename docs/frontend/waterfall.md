---
title: 瀑布流实现
postTime: 2022-04-14
categories: 前端笔记
tags:
- CSS
- 
---

::: slot abstract

**瀑布流**

瀑布流，又被称作为瀑布流式布局，是一种比较流行的网站页面布局方式，视觉表现为参差不齐的多栏布局，随着页面滚动条向下滚动，这种布局还会不断加载数据块并附加至当前尾部。

:::



## 瀑布流

### 概述

瀑布流，又被称作为瀑布流式布局，是一种比较流行的网站页面布局方式，视觉表现为参差不齐的多栏布局，随着页面滚动条向下滚动，这种布局还会不断加载数据块并附加至当前尾部。这种布局方式常见于一些图片为主的网站。

### 特征

- 内容框宽度固定，高度不固定。
- 内容框从左到右排列，一行排满后，其余内容框就会按顺序排在短的一列后。

## 实现方式

### 纯CSS实现

`column` 多行布局实现瀑布流

> column实现瀑布流主要依赖两个属性:
> `column-count` 属性，是控制屏幕分为多少列。
> `column-gap` 属性，是控制列与列之间的距离。

#### 实现步骤

在存放图片容器设置

```css
.box {
 ... 
 column-count: 2;//分为2列
 column-gap: 10px;//各列之间间距为10px
}
```

在设置`column-count`会有一个问题，它会默认让你的底部保持一行，这可能造成内容断裂，因此我们可以在子组件中设置  `break-inside: avoid;`  就可以有效的避免内容断裂。

```css
.box-item{
 ... //只设置宽度，不设置高度，由内容来决定高度
 break-inside: avoid;
}
```

#### 效果

![xg.png](https://github.com/AprilEcho/img-warehouse/blob/master/CSS%E7%80%91%E5%B8%83%E6%B5%81/xg.png?raw=true)

#### 兼容性

![column-count.png](https://github.com/AprilEcho/img-warehouse/blob/master/CSS%E7%80%91%E5%B8%83%E6%B5%81/column-count.png?raw=true)

看起来还好，大部分还是兼容的，再来看看`break-inside`的

![break-inside.png](https://github.com/AprilEcho/img-warehouse/blob/master/CSS%E7%80%91%E5%B8%83%E6%B5%81/break-inside.png?raw=true)

也是差不多，但是兼容并不是特别好

#### 后记

从完美的角度来说这不是一个合格的瀑布流方式，但是用此来实现瀑布流简单方便。

---

**2022-04-26 新增**

---

### JavaScript实现

#### 实现步骤

**html代码**

```html
<div class="box">
    <div class="wrapper" ref="wrapper">
      <p class="waterfall" :style="{ height: maxValue + 'px' }">
        <img
          class="waterfallItem"
          src="http://via.placeholder.com/70x100"
          alt="70*100"
        />
          ...
        <img
          class="waterfallItem"
          src="http://via.placeholder.com/70x70"
          alt="70*70"
        />
      </p>
    </div>
  </div>
```

**data数据**

```js
colCount: 0, //定义列数
colHeightArry: [], //定义列高度数组
imgWidth: 80, //定义图片宽度
minIndex: 0, //定义最小高度的下标
maxIndex: 0, //定义最大高度的下标
minValue: 0, //列表高度最小的值
maxValue: 0, //列表高度最高的值
```

**获取图片容器和图片列表**

```javascript
let waterBox = _this.$el.getElementsByClassName('waterfall') //获取图片容器
      let items = _this.$el.getElementsByClassName('waterfallItem') //获取图片列表
      _this.colCount = parseInt(waterBox[0].offsetWidth / this.imgWidth) //获取容器列数
```

**初始化各列高度**

```
for (let i = 0; i < _this.colCount; i++) {
   _this.colHeightArry[i] = 0 //各列高度初始化
}
```

**遍历寻找各列中最短的高度并添加到图片容器中**

```javascript
for (let index = 0; index < items.length; index++) {
  const element = items[index]
  var minValue = _this.colHeightArry[0] //定义最小的高度
  _this.minIndex = 0 //重新初始化
  _this.maxIndex = 0 //重新初始化
  _this.maxValue = 0 //重新初始化
  for (var i = 0; i < _this.colCount; i++) {
    //记录最短高度值
    if (_this.colHeightArry[i] < minValue) {
      //如果最小高度组数中的值小于最小值
      minValue = _this.colHeightArry[i] //最小高度数组中的值是真正的最小值
      _this.minIndex = i //最小下标为当前下标
    }
    //记录最长高度值
    if (_this.colHeightArry[i] > _this.maxValue) {
      _this.maxValue = _this.colHeightArry[i]
      _this.maxIndex = i
    }
  }
  element.style.left = _this.minIndex * _this.imgWidth + 'px'
  element.style.top = minValue + 'px'
  _this.colHeightArry[_this.minIndex] += items[index].offsetHeight //将加入的图片记录在当前列表
}
```

**样式设置**

```css
.box {
  width: 385px;
  height: 300px;
  border: 1px solid rebeccapurple;
  box-sizing: border-box;
  padding: 10px 30px 10px 30px;
}
.wrapper {
  overflow: hidden;
  height: 100%;
}
.waterfall {
  width: 100%;
  position: relative;
}
.waterfall img {
  width: 75px;
  position: absolute;
}
```

**完整代码**

```vue
<template>
  <div class="box">
    <div class="wrapper" ref="wrapper">
      <p class="waterfall" :style="{ height: maxValue + 'px' }">
        <img
          class="waterfallItem"
          src="http://via.placeholder.com/70x100"
          alt="70*100"
        />
        <img
          class="waterfallItem"
          src="http://via.placeholder.com/70x70"
          alt="70*70"
        />
        <img
          class="waterfallItem"
          src="http://via.placeholder.com/70x150"
          alt="70*150"
        />
        <img
          class="waterfallItem"
          src="http://via.placeholder.com/70x250"
          alt="70*250"
        />
        <img
          class="waterfallItem"
          src="http://via.placeholder.com/70x80"
          alt="70*80"
        />
        <img
          class="waterfallItem"
          src="http://via.placeholder.com/70x70"
          alt="70*70"
        />
        <img
          class="waterfallItem"
          src="http://via.placeholder.com/70x150"
          alt="70*150"
        />
        <img
          class="waterfallItem"
          src="http://via.placeholder.com/70x250"
          alt="70*250"
        />
        <img
          class="waterfallItem"
          src="http://via.placeholder.com/70x80"
          alt="70*80"
        />
        <img
          class="waterfallItem"
          src="http://via.placeholder.com/70x80"
          alt="70*80"
        />
      </p>
    </div>
  </div>
</template>
<script>
import BetterScroll from 'better-scroll'

export default {
  data() {
    return {
      colCount: 0, //定义列数
      colHeightArry: [], //定义列高度数组
      imgWidth: 80, //定义图片宽度
      minIndex: 0, //定义最小高度的下标
      maxIndex: 0, //定义最大高度的下标
      minValue: 0, //列表高度最小的值
      maxValue: 0, //列表高度最高的值
    }
  },
  computed: {},
  name: 'About',
  mounted() {
    setTimeout(() => {
      this.waterfallFn()
    }, 30)
    setTimeout(() => {
      this.scroll = new BetterScroll(this.$refs.wrapper, {
        pullUpLoad: true, //上拉加载更多
      })
      this.scroll.on('pullingUp', () => {
        console.log('上拉加载更多')
        this.scroll.finishPullUp()
      })
    }, 100)
  },
  methods: {
    waterfallFn() {
      let _this = this
      let waterBox = _this.$el.getElementsByClassName('waterfall') //获取图片容器
      let items = _this.$el.getElementsByClassName('waterfallItem') //获取图片列表
      _this.colCount = parseInt(waterBox[0].offsetWidth / this.imgWidth) //获取容器列数
      for (let i = 0; i < _this.colCount; i++) {
        _this.colHeightArry[i] = 0 //各列高度初始化
      }
      for (let index = 0; index < items.length; index++) {
        const element = items[index]
        var minValue = _this.colHeightArry[0] //定义最小的高度
        _this.minIndex = 0 //重新初始化
        _this.maxIndex = 0 //重新初始化
        _this.maxValue = 0 //重新初始化
        for (var i = 0; i < _this.colCount; i++) {
          //记录最短高度值
          if (_this.colHeightArry[i] < minValue) {
            //如果最小高度组数中的值小于最小值
            minValue = _this.colHeightArry[i] //最小高度数组中的值是真正的最小值
            _this.minIndex = i //最小下标为当前下标
          }
          //记录最长高度值
          if (_this.colHeightArry[i] > _this.maxValue) {
            _this.maxValue = _this.colHeightArry[i]
            _this.maxIndex = i
          }
        }
        element.style.left = _this.minIndex * _this.imgWidth + 'px'
        element.style.top = minValue + 'px'
        _this.colHeightArry[_this.minIndex] += items[index].offsetHeight //将加入的图片记录在当前列表
      }
    },
  },
}
</script>
<style type="text/css" scoped lang="scss">
.box {
  width: 385px;
  height: 300px;
  border: 1px solid rebeccapurple;
  box-sizing: border-box;
  padding: 10px 30px 10px 30px;
}
.wrapper {
  overflow: hidden;
  height: 100%;
}
.waterfall {
  width: 100%;
  position: relative;
}
.waterfall img {
  width: 75px;
  position: absolute;
}
</style>
```

