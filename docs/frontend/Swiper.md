---
title: Swiper的基本使用
postTime: 2022-05-06
categories:
- 前端笔记
tags:
- CSS
---



::: slot abstract

**Swiper的基本使用**


:::

## Swiper基本使用

### 修改分页器样式

- 指定分页器容器的css选择器或HTML标签。

```javascript
pagination: {
  el: '.swiper-pagination1',
}
```

- 修改CSS样式

```javascript
//未活跃时分页器的样式
.swiper-container .swiper-pagination-bullet{
	...
}
//活跃状态下的分页器样式
.swiper-container .swiper-pagination-bullet.swiper-pagination-bullet-active{
	...
}
```

### 修改前进后退按钮样式

修改前进后退按钮的样式相对分页器的样式简单，同样也是需要指定容器的css选择器或HTML标签，同时修改该选择器的样式即可。

- 指定前进后退按钮容器的css选择器或HTML标签。

```JavaScript
navigation: {
  nextEl: '.swiper-button-next',
  prevEl: '.swiper-button-prev',
},
```

- 修改CSS样式

```JavaScript
.swiper-container .swiper-button-next, .swiper-container .swiper-button-prev{
  ...
}
```

### 场景使用

#### 点击按钮实现每一屏切换

- 给每个按钮设置一个自定义属性来对应每一屏的索引
- 监听每个按钮的点击属性，结合swiper的slideTo属性实现切换，同时修改自身激活状态

```javascript
// 点击切换屏幕
this.item.on('click', function () {
  //关键代码
 swiper1.slideTo($(this).attr('data-page'), 500, false)
 this.item.removeClass('na-active').eq(that.activeIndex).addClass('na-active')
})
```

- 当我们滑动切换轮播图时，需要通过on属性来修改按钮的激活状态（上方是通过点击修改样式，此处是通过轮播图的滑动效果实现切换屏）
  - 值得注意的是：swiper自带当前轮播图索引activeIndex属性，所以我们只需要在on属性动态修改原先索引值就可以

```javascript
on: {
  //轮播图切换
  slideChange: function () {
  //修改当前索引值
  that.activeIndex = this.activeIndex
  that.item.removeClass('na-active').eq(that.activeIndex).addClass('na-active')
  },
},
```

#### 轮播图与轮播图中文本滚动条结合

- 案例说明：由于在外层轮播图使用了鼠标滚动切换屏的功能，而当轮播图中存在文本滚动条时会因为外层轮播图鼠标滚动效果而失效，因此，我们需要在鼠标移入文本框内容的时候将外层轮播图鼠标滚动切换屏的功能取消。

```javascript
$(".swiper-container2").hover(function () {
  swiper1.mousewheel.disable();
}, function () {
  swiper1.mousewheel.enable();
})
```
