---
title: 瀑布流实现
postTime: 2022-04-14
categories: 前端笔记
tags:
- CSS
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

### 其它方式实现



