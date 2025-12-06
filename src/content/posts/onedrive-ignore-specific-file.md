---
title: OneDrive设置忽略指定名称和类型文件
published: 2025-12-06
description: OneDrive有时候我们不想同步指定文件就非常头大了;不过按照微软的习惯，他总会给企业或大客户系统管理员留一些神奇的组策略和注册表
tags: [教程, OneDrive, 软件]
category: 软件
draft: false
---

## 提要

作为和Windows结合最紧密的同步盘软件（废话，毕竟是微软自家的）

OneDrive最多使用的肯定就是「同步模式+文件随选」了，他直接将所有文件同步到Onedrive，在需要使用的时候才下载文件。

除此之外，它还和Windows自带的「存储感知」配合得很好，支持自动释放不经常使用的文件，节省空间；现在，把文档、桌面、图片等文件夹通过OneDrive进行同步也成为了推荐操作，这样可以在不同Windows电脑间共享文档和设置，非常方便。

![](/images/onedrive-ignore-specific-file-01.png)

但是有时候我们不想同步指定文件就非常头大了，OneDrive并没有自带一个方便的忽略指定文件的功能；不过按照微软的习惯，他总会给企业或大客户系统管理员留一些神奇的组策略和注册表。所以现在有两种方法可以实现:

## OneDriveIgnoreEditor （推荐）

因为编写注册表比较麻烦还容易出错，所以我编写了一个图形化管理忽略文件的小程序：

下载 [OneDriveIgnoreEditor (Github)](https://github.com/mrbbbaixue/OneDriveIgnoreEditor/releases)

![](/images/onedrive-ignore-specific-file-02.png)

软件使用的方法很简单：

如果要新建一项忽略规则，点击「新增」即可。

如果要删除一行规则，点击选中要删除的行，按键盘上的DEL键就能删除。

然后点击「保存」保存规则，然后点击「重启OneDrive」应用更改。

程序现在只支持Windows 10以上版本，并要求安装NET 8运行库。

至于现在很别扭的UX，后面等有人用了再优化吧，说不定我啥时候就突然想继续做了。

不过由于OneDrive本身的限制，忽略文件似乎不支持忽略一个指定的文件，只能根据文件名匹配规则来进行处理。并且只对新增加的文件生效。也就是说，如果你想忽略已有文件，只能先移出去再移回来。

![](/images/onedrive-ignore-specific-file-03.png)

## 编辑注册表

编辑注册表比较麻烦，反正小工具的原理也是修改注册表，不如用小工具。

首先按Win+R，输入「regedit」打开注册表编辑器，然后依次打开：

`HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\OneDrive\EnableODIgnoreListFromGPO`

如果没有`EnableODIgnoreListFromGPO`这一项，那么就依次创建（右键文件夹新建项）

![](/images/onedrive-ignore-specific-file-04.png)

然后，点击`编辑 - 新建 - 字符串值`，数值名称任意，数值数据中填写要忽略的文件的文件名（含扩展名）；当然，使用*也是可以的。

![](/images/onedrive-ignore-specific-file-05.png)

![](/images/onedrive-ignore-specific-file-06.png)

最后，重启OneDrive以应用更改。

## 组策略

通过组策略进行修改的方法有点麻烦，所以懒得写。
不过这个组策略方式也是通过修改注册表来应用设置的，所以直接改注册表也可以。