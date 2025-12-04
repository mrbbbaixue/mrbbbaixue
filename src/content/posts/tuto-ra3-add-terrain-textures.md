---
title: 给RA3添加新的地表贴图
published: 2025-07-04
description: 转了半天发现添加新的地表贴图的Mod只有将军演变一个，这怎么行！这边就简单总结一下添加地表贴图的步骤和需要注意的事项
tags: [教程, RA3]
category: 教程
draft: false
---

转了半天发现添加新的地表贴图的Mod只有将军演变一个，这怎么行！这边就简单总结一下添加地表贴图的步骤和需要注意的事项。

感谢GenEvo的制作成员提供的指导，以及阿紫帮我编写教程（最近比较忙其实主要是她写）

## 1. 准备工作

### 工具：

**图像编辑工具：**
- **Substance Painter**：用于直观的绘制贴图。  

- **Photoshop / GIMP**：用于调整贴图和合并图层。  
  - *如果你不会用，最好先找个教程学会怎么使用图像编辑软件——毕竟，本教程对此无能为力。*
  - 其实推荐使用GIMP，分通道操作非常方便

- **zyb的万能工具箱**：推荐使用这个工具！由Zyb制作的快速在线工具，能够一键完成贴图调整：[访问（需要注册）](https://zybdatasupport.online/terrainGenerate)

- **RA3 MOD SDK**：MOD制作必须的资产打包器。  
  - *推荐使用由Bibber调校的版本（事实上作者并不相信有人能在中国大陆找到其他版本），相信我，你不会想用EA提供的原版的。*

- **RA3 WorldBuilder**：用于将纹理应用到地图中。  
  - *推荐使用由物w制作的版本，它比原版的性能更好、闪退更少且功能更全面。*

> **注意**：所有地面贴图的格式都***只能是 八位 TGA 格式***，且***不能被压缩***，大小必须为 **256像素x256像素**。

---

## 2. 文件结构

### 地形贴图的位置：

- **地形贴图文件**：地形贴图应保存在 `Additional/Arts` 中的 `Terrain` 文件夹内。  
  - *`Additional` 文件夹是存放额外文件的默认位置。*

![](/images/tuto-ra3-add-terrain-textures-01.png)

在这里

- **注册表**：地形贴图的注册表文件 `Terrain.xml` 应当被放入普通资产文件夹（默认是 `Data`）之下的文件夹内。不需要把它放在全局文件夹（默认是 `Data/Mapmetadata`）里。  
  - *你可以通过修改打包器的资产读取规则来改变这些文件夹的目录结构。*

---

## 3. 地形贴图的构成

### 两张贴图：
- **混合着色贴图**（Blend-Color Map）：记录了颜色和光滑度。
  - Substance Painter可以直接输出混合着色贴图，但需要特别的设置。我们之后会讲。
> **注意**：混合着色贴图的格式只能是 ***八位RGBA的*** TGA 格式，且不能被压缩，大小必须为 256x256。为了防止你忘记，我们之后会不断念叨这件事的。
- **法线贴图**（Normal Map）：用于提供表面细节的法线信息。
> **注意**：法线贴图的格式应该是***OpenGL格式***。没错，我知道RA3使用DirectX，但是……请记住这一点。法线贴图的格式应该是***OpenGL格式***。***OpenGL格式的识别方法是，红色通道亮光从右边照射，绿色通道亮光从上方照射。***

![](/images/tuto-ra3-add-terrain-textures-02.png)

OpenGL格式与DirectX格式的差异

![](/images/tuto-ra3-add-terrain-textures-03.png)

红色通道亮光从右边照射,绿色通道亮光从上方照射

### 制作方法一：如果你不会画贴图

#### 步骤一：获取素材
- 如果你不会画贴图，可以去素材网站上下载一个贴图。确保你得到的文件里包含了以下三张贴图————
  - **Color**（颜色贴图）
  - **Normal**（法线贴图）
  - **Roughness**（粗糙度贴图）
    - *如果你下载的文件里有一张光滑度贴图那就更好了。*

- 如果你连什么是素材网站也不知道的话……算了，这就有一个不是吗？→ [polyhaven.com](polyhaven.com)

#### 步骤二：制作混合着色贴图
> *以下所有的步骤都可以在 **zyb的在线工具箱** 里一键完成。但是为了让你理解我们在干什么，作者认为还是有必要介绍下这个流程的。*
- **2.1 读取 Color 贴图**：使用 Photoshop 或其他图像编辑软件读取 Substance Painter 生成的 `Color` 贴图。
- **2.2 处理 Roughness 贴图**：
  - 读取 **Roughness** 贴图并转换为 8 位灰度图（调整为黑白灰度值）。
  - 进行颜色反相（将黑色变为白色，白色变为黑色）以符合游戏引擎的需求。
    - *对，这一步的目的是把粗糙度贴图转换成光滑度贴图。所以这就意味着如果你用的是zyb的在线工具，你需要输入的是**粗糙度贴图**——不要自己执行转换，把它留给机器。*
    - *如果你准备自己做的话，下载一张光滑度贴图会省事不少。*
- **2.3 合并贴图**：
  - 将转换好的 **Roughness** 贴图（或者说，新的 **光滑度贴图** ）的数据作为 **Color** 贴图的 Alpha 通道（透明度），合并这两张贴图。举例来说，在 Photoshop 中，你可以使用 `Channels` 面板将 **Roughness** 转换为 Alpha 通道，然后合并。
- **2.4 缩放贴图**：将合成的图像缩放至 **256x256** 像素，以符合 RA3 的贴图大小要求。
- **2.5 输出混合着色贴图**：将合成后的图像保存为 **TGA** 格式，根据需要修改名称。
> **注意**：确保混合着色贴图的格式是 ***未被压缩的八位RGBA*** TGA 格式！希望你还记得这一点！
#### 步骤三：制作法线贴图
- **3.1 读取 Normal 贴图**：打开 **Normal** 贴图文件（NRM 文件），将其缩放至 **256x256** 像素。
- **3.2 输出法线贴图**：保存缩放后的 **Normal** 贴图为 **TGA** 格式，根据需要修改名称。
> *因为 **zyb的在线工具箱** 的设置是为批量转换设计的，所以，截至写作时（也就是说后续肯定会修改，请根据网站上的指示操作！），上传的三张贴图需要有相同的文件名——zyb建议将这三张贴图分别保存到三个不同的文件夹里。例如：`color/Concrete041C_1K-PNG.png`，`normal/Concrete041C_1K-PNG.png`，`roughness/Concrete041C_1K-PNG.png`*


### 制作方法二：如果你会画贴图
- 显然，本教程并不负责教你怎么画贴图。作者的目的是教你如何输出一张合格的地面贴图。
> **注意**：希望你还记得，混合着色贴图的格式只能是 ***八位RGBA的*** TGA 格式，且不能被压缩，大小必须为 256x256。法线贴图的格式应该是***OpenGL格式***。
- 在 **输出模板** 页面设置输出格式：
  - **法线贴图**：选择 **RGB** 输出类型，拖动 **Normal OpenGL** 到 RGB 栏。输出的法线贴图格式为 **八位RGB格式的TGA贴图**。
  - **混合着色贴图**：选择 **RGB+A** 输出类型，拖动 **BaseColor** 到 RGB 栏，将 **Glossiness** 拖到 A 栏。输出的混合着色贴图格式为 **八位RGBA格式的TGA贴图**。

- 命名：
  - **法线贴图命名**：你可以手动命名，也可以在法线贴图前面的命名框里输入 `$project_NRM`，这样在输出时就会自动生成以项目名为前缀的法线贴图命名。
  - **混合着色贴图命名**：同样，你可以手动命名，也可以在混合着色贴图前面的命名框里输入 `$project`，这样在输出时就会自动生成以项目名为前缀的混合着色贴图命名。

![](/images/tuto-ra3-add-terrain-textures-05.png)

你应该看到，你的输出页面看起来是这样的

---

## 4. 注册贴图
在注册贴图前，希望你检查一下格式——你应该没有忘记格式是什么吧？

> **注意**：所有地面贴图的格式都***只能是 八位 TGA 格式***，且***不能被压缩***，大小必须为 **256x256**。  

看来我们得到的贴图完美符合格式。那么，接下来将生成的贴图注册到 `Terrain.xml` 文件中。格式如下：

```xml
<TerrainAsset id="Dirt_Romania01" Class="Dirt" WBFolder="Romania" Texture="Dirt_Romania01.tga" BumpTexture="Dirt_Romania01_NRM.tga" />
```

这里，Class代表贴图的类型，一般情况是可以随意设置的；WBFolder指的是放入WB的贴图绘制的哪个文件夹，一般建议自己新建一个，可以随便起名。

Class可以参考SDK的`AssetTypeTerrainAsset.xsd`文件，有这么几个类型：

```xml
<xs:simpleType name="TerrainClassType">
    <xs:restriction base="xs:string">
        <xs:enumeration value="UNSPECIFIED"/>
        <xs:enumeration value="Misc"/>
        <xs:enumeration value="Dirt"/>
        <xs:enumeration value="Cliff"/>
        <xs:enumeration value="Grass"/>
        <xs:enumeration value="Rock"/>
        <xs:enumeration value="Road"/>
        <xs:enumeration value="Mud"/>
        <xs:enumeration value="Sand"/>
        <xs:enumeration value="Shrub"/>
        <xs:enumeration value="Snow"/>
    </xs:restriction>
</xs:simpleType>
```

因为xml不分行，所以你想怎么安排属性都可以——无论是像官方xml那样每个属性一行，或是把整个元素放在一行内，都是可以的！

![](/images/tuto-ra3-add-terrain-textures-06.png)

这是一个示例XML
