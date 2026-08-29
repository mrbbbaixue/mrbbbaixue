---
title: DeepSeek Harness（DSH）插件推荐：让大肥鱼更好用的插件
published: 2026-08-29
description: DeepSeek 开源的 Agent 框架 DeepSeek Harness（dsh）靠着"一切皆插件"的架构，上线不久生态就已经爆发。本文精选 7 个实用插件：侧边栏工作台、上下文可视化、回复内嵌 UI、订阅账号当模型源、第三方模型接入、划词批注、状态文字轮换，附 GitHub 地址和安装命令。
image: /images/dsh-plugins-01.png
tags: [DSH, DeepSeek, AI, 插件]
category: 软件
draft: false
---

## 先说说 DeepSeek Harness 是什么

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（命令行 `dsh`）是 DeepSeek 开源的 Agent 框架。它最大的特点是**一切皆插件**：模型、工具、技能、会话、沙箱、UI……所有能力都由基于 [Cordis](https://github.com/cordiverse/cordis) 的插件组合而成，想换哪个就换哪个。目前还处于开发者预览期，迭代很快，但生态已经相当热闹——GitHub 上带 `dsh-plugin` 话题的仓库已经有好几千个。

装 DSH 本体只需要 Node.js，然后：

```sh
npx @deepseek-ai/dsh web
```

它会默认在 `http://127.0.0.1:3080` 启动一个 Web UI 并自动打开浏览器。


## 插件怎么装

所有插件共用同一套安装方式：

```sh
dsh plugin --profile web add <插件包名>
```

几个注意点：

- `--profile` 是必填参数，`web` 是最常用的 profile（`dsh web` 其实就是 `--profile web` 的别名）；
- `dsh plugin` 本质上是转发给 pnpm 执行，所以**环境里要有 pnpm**（没有的话先 `corepack enable` 或 `npm i -g pnpm`，然后开个新终端）；
- 大部分插件装完**需要重启一次 dsh web** 才能看到效果；

先放一张总览，后文按推荐顺序逐个展开：

| 插件 | 一句话简介 | GitHub |
| --- | --- | --- |
| dsh-better-sidebar | 侧边栏工作台：文件、终端、Git、内嵌浏览器全都有 | [omdsh-dev/DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) |
| dsh-context | 上下文可视化仪表盘，看清 Agent 的"脑子里装了什么" | [bowenliang123/dsh-context](https://github.com/bowenliang123/dsh-context) |
| dsh-genui | 让回复里直接长出可交互的图表、表单和面板 | [omdsh-dev/dsh-genui](https://github.com/omdsh-dev/dsh-genui) |
| dsh-plugin-subscriptions | 用 ChatGPT / Claude / Grok / Copilot 订阅当模型源 | [V1ki/dsh-plugin-subscriptions](https://github.com/V1ki/dsh-plugin-subscriptions) |
| dsh-commandcode-provider | 接入 Command Code 的模型目录，支持多账号轮换 | [Mars-Sea/dsh-commandcode-provider](https://github.com/Mars-Sea/dsh-commandcode-provider) |
| dsh-annotation | 划词批注，回车随消息一起发给模型 | [omdsh-dev/dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) |
| dsh-status-rotator | 把"Deep diving…"换成你自己的花式状态文字 | [01Virex/dsh-status-rotator](https://github.com/01Virex/dsh-status-rotator) |


## 1. dsh-better-sidebar：把侧边栏变成完整工作台

⭐ 3000+ ｜ MIT ｜ 支持 DSH 0.1.0-rc.8 ~ 0.1.2-alpha.1

![](/images/dsh-plugins-01.png)

装完 DSH 之后我推荐第一个装的就是它。原版 Web UI 比较毛坯，甚至没有右侧栏，这个插件给你搭了一个**右侧栏 + 底部面板**：

- **文件工作台**：目录树 + 编辑器，Markdown（含 Mermaid 图表）、图片、HTML、PDF 都能预览；
- **终端**：xterm.js + node-pty 跑的 shell，断线重连有回放；
- **Git 面板**：暂存 / 提交 / 还原 / 历史，点开文件是 VSCode 式的红绿 diff；
- **内嵌浏览器**：多开网页 tab，内容跑在沙箱 iframe 里，聊天里的外链可以接管到侧边栏打开；
- **后台任务**：子代理 + 后台任务清单（退出码、实时输出、强制终止）；
- **侧边对话**：Codex 风格的侧边线程，继承主会话完整上下文独立运行，不污染主会话，聊得好还能一键"保存为新会话"。

更难得的是它的**服务化设计**：内置的这些页面和第三方插件走同一套 `ctx.betterSidebar` API（`registerTab` / `registerFileViewer`），官方不做的功能交给生态补——它 GitHub topic 下已经挂了 28+ 个扩展插件（Excel 编辑、SVN 面板、SSH 隧道、对话大纲……）。

安装：

```sh
dsh plugin --profile web add dsh-better-sidebar@latest
```


## 2. dsh-context：看清 Agent 的上下文都花在哪了

⭐ 1100+ ｜ Apache-2.0

![](/images/dsh-plugins-02.png)

用 Agent 干活最玄学的问题就是："为什么它突然变笨了？上下文里到底塞了什么？"这个插件把答案直接画给你看。打开任意会话的 ** 上下文标签页**，你会得到一整套仪表盘：

- **Current Context**：一条六色堆叠条，系统提示词、工具 Schema、用户消息、注入内容、助手回复、工具结果各占多少 token 一目了然——对话开始"退化"时，就是在这里看到底是谁把预算吃光的；
- **Context Trend**：每个模型请求一条堆叠柱，逐轮观看窗口怎么涨起来的，压缩 / 剪枝事件用 ✂ 钉在发生的柱子上，还有 Delta 模式看每一步的增减；
- **Context Browser**：把任意一次请求"开箱"——每个元素都能展开看到实际内容（系统提示词、工具 JSON Schema、消息原文、工具输出），还能和上一轮做 diff；
- **Context Events**：每次注入、压缩、剪枝、模型切换的日志，谁干的、回收了多少 token 都有记录；
- **File Activity / Agent Network**：Agent 对文件的读写统计，以及当前 agent + 所有子代理的家谱图。

而且不想开侧栏的话，输入 `/context` 命令也能在聊天里弹出同样的面板。

```sh
dsh plugin --profile web add dsh-context@latest
```

![](/images/dsh-plugins-07.png)

## 3. dsh-genui：让回复直接长出界面

⭐ 350+ ｜ MIT ｜ [在线演示站](https://omdsh-dev.github.io/dsh-genui/)

![](/images/dsh-plugins-03.png)

这个插件玩的是 GenUI（Generative UI）：模型回复里的 `dsh-ui` 代码块会被渲染成**真正的交互组件**，而不是干巴巴的文字或代码。问一句"这个月订单怎么样"，回答里可以直接长出统计卡片、趋势图、可排序的表格；它内置 30+ 组件——卡片、表格、图表、表单、测验、文件树、时间线、diff、ECharts、Mermaid、3D 场景……

![](/images/dsh-plugins-08.png)

我最喜欢的是 `plot` 组件：画函数曲线的同时给一排参数滑块，拖动滑块曲线实时重绘，调参体验比截图粘贴强太多了。组件是**边流式输出边渲染**的，不用等整条消息写完；带 `panel: true` 的回复还会挂一个可调整大小的持久会话面板。组件上的按钮点击后会以 action 事件回传给模型，形成"模型出界面、你点按钮、模型接着干活"的闭环。

安装后随便开个会话说一句即可验证：

```sh
dsh plugin --profile web add @changfenhuang/dsh-genui
```

```text
Use dsh-ui to draw a stats dashboard with a sortable service table.
```

## 4. dsh-plugin-subscriptions：把各家订阅直接当模型源

⭐ 290+ ｜ 装完去 Settings → Subscriptions 登录

![](/images/dsh-plugins-04.png)

如果你手上已经有 ChatGPT Plus/Pro、Claude Pro/Max、X Premium 或者 GitHub Copilot 的订阅，这个插件能让它们直接变成 DSH 的 LLM provider——**全程 OAuth 登录，不需要任何 API key**：

- 在设置页点 Connect，浏览器里完成授权并自动刷新；
- 登录后对应家的模型进入会话模型选择器，带 reasoning effort 档位选择，Codex 还有 Standard / Fast 速度开关；
- 每个账号显示**订阅用量**：5 小时窗口、每周窗口的百分比进度条和重置时间，额度快见底了一目了然；
- 附赠几个好用的工具：Grok 的 `x_search`（带引用的 X 搜索）、`image_generate`（GPT 和 Grok 的图像后端二选一）、`video_generate`（生成视频直接在会话里内联播放）。

有多账号的话还能组池：同一个模型在多个账号间自动故障转移，按"剩余额度 / 窗口剩余时间"的燃烧率打分挑账号，不会把一个号薅到死。

```sh
dsh plugin --profile web add dsh-plugin-subscriptions
```

![](/images/dsh-plugins-09.png)

## 5. dsh-commandcode-provider：接入 Command Code 模型目录

⭐ 120+ ｜ MIT ｜ 非官方社区集成

![](/images/dsh-plugins-05.png)

Command Code 用户看过来：这个插件把 [Command Code](https://commandcode.ai) 接进 DSH，注册一个 `commandcode` provider 。亮点包括：

- 设置页支持浏览器内 OAuth （和官方 `cmd login` 同一条授权流程）；
- **多账号轮换**：一个号额度用尽自动切下一个，`/commandcode` 命令随时查每个账号的用量；
- 模型选择器里带标注：最低套餐、FREE 徽章、峰/谷时段、是否支持图像、上下文窗口大小，免费模型排前面；
- 高于你套餐的模型默认隐藏，Vision 模型可以直接喂图。

需要你自己的 Command Code 账号。

```sh
dsh plugin --profile web add @mars-sea/dsh-commandcode-provider@latest
```

## 6. dsh-annotation：划词批注，回车发送

⭐ 100+ ｜ MIT ｜ [在线演示 ](https://omdsh-dev.github.io/dsh-annotation/)

![](/images/dsh-plugins-06.png)

看长回复的时候想指着某段说"这里展开讲讲"？这个插件就是干这个的：**选中回复里的任意文字 → 写批注（可以不写，纯标记）→ 回车**，批注块就随消息一起发给模型。体验细节做得很讲究：

- 批注跨消息、跨轮次，输入框旁出现 `Annotations ×N` 小芯片，悬停可查看、逐条删除；
- 模型会按 `Annotation 1: …` `Annotation N: …` 逐条对照回复，每个标号还是可悬浮的芯片，能看到你批注的原文和笔记。

```sh
dsh plugin --profile web add @changfenhuang/dsh-annotation
```

## 7. dsh-status-rotator：花式状态文字，大肥鱼的表情包

⭐ 50+ ｜ 纯趣味，但做得意外地认真

这个插件没有截图可放，因为它的效果得"用"才能体会：它把 Web UI 里执行任务时那句 `Deep diving...` 状态文字**换成你自定义的文案轮播**——

- 打字机逐字输出 + 彩虹渐变动画（都可以关）；
- 模板占位符是活的：`{elapsed}`（计时）、`{model}`（当前模型）、`{tps}`（每秒 token 数）……比如"正在写代码 {elapsed}"，文字里就带一个跳动的时钟；
- 还能轮换**浏览器标签页标题**、挂一个实时状态 pill，以及——弹幕模式，你的短语像视频网站的弹幕一样从页面背后飘过。

文案全在 `config.json` 里改，也可以在设置页里可视化编辑，保存即生效不用重启。工作再忙，也得让 Agent 陪你整点活。

```sh
dsh plugin --profile web add dsh-status-rotator
```

## 写在最后

如果你刚入坑 DSH，我的建议是先装 `dsh-better-sidebar` 打好底子，再按需加上 `dsh-context` 观察上下文、`dsh-genui` 提升展示效果；手上有订阅的加 `dsh-plugin-subscriptions`，最后来个 `dsh-status-rotator` 调剂心情。祝玩得开心，也记得给喜欢的插件点个 star。
