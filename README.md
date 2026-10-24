

![科技社](https://hkems-stmo.top/assets/images/brand/logo-wide.png)

基于 **Material Design 3** 重写的社团官网。整站零框架、零构建步骤，双击 `index.html` 即可浏览，也可以直接部署到 GitHub Pages。

- **设计语言**：Material Design 3 —— 语义色角色（浅色 / 深色）、字号阶梯、形状与高度体系、状态层与动效曲线。
- **字体**：拉丁字母与数字使用自托管的 **Google Sans Flex**（可变字重，SIL OFL 1.1）；中文使用各平台的系统字体（苹方 / 微软雅黑 / Noto Sans CJK）。两者通过 `unicode-range` 分工，详见 `assets/fonts/README.md`。
- **亚克力**：顶栏、面板与弹窗使用 `backdrop-filter` 磨砂材料，配合细噪点纹理；不支持该属性或系统开启“减少透明度”时自动降级为不透明表面。全站不使用渐变。
- **无框架依赖**：不使用 Bootstrap、jQuery、图标字体或评论插件。图标为内联 SVG 精灵。
- **header / footer 分离**：两处结构各自只有一个文件，页面里只留一个占位元素。

---

## 目录结构

```text
site/
├─ index.html                     首页
├─ 404.html                       GitHub Pages 404 页
├─ robots.txt  sitemap.xml        SEO
├─ manifest.webmanifest           PWA 清单
├─ .nojekyll                      让 GitHub Pages 原样发布文件
├─ CNAME  LICENSE
├─ pages/
│  ├─ activity/
│  │  ├─ use-scheduling.html          科技教室使用安排
│  │  └─ culture-creative-2023.html   2023 年实验文创预售
│  ├─ admin/
│  │  └─ memo.html                    科技社规划备忘录
│  ├─ prank/
│  │  └─ BD7QBG.html                  新型无线电简语 “QBG”
│  ├─ games/
│  │  ├─ 2048.html                    2048（2048 / 128 两种目标）
│  │  └─ whack-a-mole.html            打地鼠
│  └─ article-template.html       新建文章时复制的骨架
└─ assets/
   ├─ css/
   │  ├─ tokens.css                设计令牌：颜色 / 字体 / 形状 / 高度 / 动效
   │  ├─ base.css                  Reset、页面画布、布局原语、排版、工具类
   │  ├─ glass.css                 亚克力材料与降级策略
   │  ├─ components.css            顶栏、抽屉、按钮、卡片、对话框、轮播、页脚
   │  ├─ home.css                  首页
   │  ├─ article.css               文章 / 活动页
   │  └─ game.css                  2048、打地鼠
   ├─ js/
   │  ├─ core/
   │  │  ├─ theme.js               首屏前应用主题，避免闪白
   │  │  └─ ui.js                  图标精灵、涟漪、滚动进度、提示条、WebAudio
   │  ├─ layout/
   │  │  ├─ header.js              顶栏 + 抽屉 + ⌘K 站内搜索
   │  │  └─ footer.js              页脚 + 返回顶部 + 用户协议弹窗
   │  └─ pages/
   │     ├─ home.js                轮播
   │     ├─ article.js             目录、滚动高亮、视频懒加载
   │     ├─ 2048.js                2048 游戏逻辑
   │     └─ whack-a-mole.js        打地鼠
   ├─ fonts/
   │  ├─ google-sans-flex-latin-variable.woff2   拉丁子集，字重 300–800
   │  ├─ OFL.txt                    SIL Open Font License 1.1
   │  └─ README.md                  字体来源与回退说明
   ├─ images/
   │  ├─ brand/                    标志、社徽、社旗、图标、分享图
   │  ├─ activities/               活动封面与规划图
   │  ├─ articles/                 文章配图
   │  └─ news/                     动态配图
   ├─ docs/club-contact.pdf        社团联系方式
   └─ videos/standee.mp4           立牌展示视频（`preload="none"`，不点不下载）
```

所有资源引用均为**相对路径**，并随所在层级调整（`assets/…`、`../../assets/…`），因此放在任意子目录、任意域名下都能正常工作。

---

## 页面接入约定

每个页面只需要三样东西：

```html
<html lang="zh-CN" data-root="../.." data-page="article">
```

- `data-root`：到站点根目录的相对前缀，根目录为 `""`，`pages/` 下为 `"../.."`。
- `data-page`：用于顶栏高亮，可选 `home / news / about / contact / article / games`。

```html
<header class="top-app-bar" id="site-header"></header>
...
<footer id="site-footer"></footer>

<script src="../../assets/js/core/ui.js" defer></script>
<script src="../../assets/js/layout/header.js" defer></script>
<script src="../../assets/js/layout/footer.js" defer></script>
<script src="../../assets/js/pages/article.js" defer></script>
```

脚本顺序必须是 `ui → header/footer → 页面脚本`，它们都是普通脚本（非 ES module），所以本地 `file://` 直接打开也能运行。

### 新增一篇文章

1. 复制 `pages/article-template.html` 到目标目录，重命名为英文小写短横线形式。
2. 修改 `data-root`、`<title>`、描述、面包屑与正文；每个 `h2/h3` 保留唯一 `id`，目录会自动生成。
3. 把图片放进 `assets/images/articles/`，用 WebP，长边不超过 1600px。
4. 在 `assets/js/layout/header.js` 的 `SEARCH_INDEX` 与 `sitemap.xml` 里补一条记录。

### 用户协议

首次访问会在页面加载后弹出用户协议与隐私政策，用户的选择保存在 `localStorage` 的 `hkems-consent` 键中；之后可在页脚随时重新打开。

---

## 本地预览

直接双击 `index.html` 即可。若想以 HTTP 方式查看（推荐，缓存与绝对路径行为更接近线上）：

```bash
python -m http.server 8080 --directory site
# 然后访问 http://localhost:8080/
```

---

## 相比旧版的改动

| 项目 | 旧版 | 新版 |
| --- | --- | --- |
| UI 框架 | Bootstrap 5 + jQuery 3.6 + Bootstrap Icons | 无框架，自建设计令牌与组件 |
| 样式 | `common.css` / `index.css` / `text.css` 交织 | 分层：tokens → base → glass → components → 页面 |
| 页眉页脚 | jQuery `.load()` 拉取 HTML 片段 | 独立的 `header.js` / `footer.js` 组件，无依赖 |
| 图标 | Bootstrap Icons 字体 | 内联 SVG 精灵，按需使用 |
| 图片 | 原图直出，最大 6 MB | 统一转 WebP 并压缩，最大不超过 1600px |
| 背景音乐 | 3.4 MB MP3 用于倒计时 | WebAudio 合成提示音，无音频文件 |
| 用户协议 | 强制弹窗 + Cookie 拦截浏览 | 首次访问弹窗，之后可在页脚查看 |
| 站内搜索 | 跳转 Bing `site:` 查询 | ⌘K / Ctrl+K 本地搜索 |
| 主题 | 仅浅色 | 浅色 / 深色跟随系统，可手动切换并记忆 |
| 响应式导航 | 折叠菜单 + 手写图标切换 | MD3 抽屉，键盘与 Esc 可操作 |

### 被移除的内容

- `js/bootstrap*.js`、`js/jquery*.js`、`js/popper.min.js`、`js/md5.min.js`、`js/talk.js`、`js/password.js`、`css/bootstrap*.css`、`css/talk.css`、`fonts/`：框架与第三方依赖。
- `function/*.html`（页眉、页脚、语言页、窄屏提示、退出页）：由 `assets/js/layout/*` 取代。
- `uptime/`：外部监控面板，与社团内容无关。
- `sitemap/提交脚本.bat`、`sitemap/*.txt`：改为标准 `sitemap.xml`。
- `pages/games/2048-128max/`：与 2048 重复，合并为一个页面切换目标。
- `pages/games/Make-Qian-Xue-head-boom/`：原页面只有一个空容器，且用真人头像做击打对象，改为通用鼹鼠。
- `pages/admin/2027.html`、`pages/tools/*`（时钟、电子木鱼）：按维护要求下线。
- `memo.html` 的前端口令验证：任何人都能绕过，改为公开记录页。
- Gitalk 评论：依赖 GitHub OAuth 与个人仓库，已移除。

> `assets/videos/standee.mp4` 是原仓库里的立牌展示视频（约 15 MB），保留了但设置 `preload="none"`，不点击播放就不会下载。若想进一步缩小仓库，删除该文件并去掉文创页里对应的视频卡片即可。

---

## 浏览器支持

| 浏览器 | 版本 |
| --- | --- |
| Chrome / Edge | 111+ |
| Safari / iOS Safari | 16.4+ |
| Firefox | 113+ |

依赖 `color-mix()`、`backdrop-filter`、`<dialog>`、`IntersectionObserver`。旧版浏览器会自动降级：磨砂面板变为不透明表面，主题仍可切换，功能不受影响。

无障碍：全站可键盘操作，搜索框支持 `↑ ↓ Enter Esc`，弹窗使用原生 `<dialog>` 焦点管理，尊重 `prefers-reduced-motion` 与 `prefers-reduced-transparency`。

---

## 版权

- 站点代码以仓库内 `LICENSE`（**木兰宽松许可证，第 2 版 / Mulan PSL v2**）发布，可自由使用、修改与分发。
- 社徽、社旗、活动照片、文创图片、视频等素材版权归海口实验中学科技社所有，未经许可请勿转载。
- 字体：Google Sans Flex（Copyright 2015 Google LLC）以 SIL Open Font License 1.1 授权，许可原文在 `assets/fonts/OFL.txt`；中文字体调用系统自带字体，不随站点分发。
- 2048 的玩法源自 [Gabriele Cirulli](https://gabrielecirulli.com) 的开源项目，本页为独立实现。

技术支持：MQSI · 邮箱 `HKEMS-STMO@outlook.com` · QQ `3478298786`
