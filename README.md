# 不可言 · AI 接单 介绍页

给从抖音过来的人看的一页纸：我在淘宝派单群里怎么接单、怎么用 AI 做、进群能拿到什么，最后加微信。
纯静态，没有任何第三方依赖，不收集访客数据。

## 文件

- `index.html` —— 结构、全部文案、SEO 标签、结构化数据
- `styles.css` —— 样式，手机优先
- `script.js` —— 菜单、复制微信号、二维码、手机端底部悬浮按钮；联系方式在最上面的 `CONTACT`
- `assets/og-image.png` —— 分享到微信、QQ、微博、搜索结果时显示的大图（1200×630）
- `assets/share-300.png` —— 微信聊天里转发链接时抓的缩略图（300×300）
- `assets/apple-touch-icon.png`、`favicon.svg` —— 图标
- `assets/wechat-qr.png` —— 微信二维码（从你的微信名片图里裁出的二维码部分，640×640；换二维码时直接覆盖这个文件）
- `robots.txt`、`sitemap.xml`、`llms.txt` —— 给搜索引擎和 AI 搜索看的
- `set-domain.ps1` —— 上线后一次性把占位域名换成真域名

## 已经填好的

- 微信号 `15527138700`（在 `script.js` 的 `CONTACT.wechat`），访客点“复制微信号”才显示，HTML 源码里搜不到。
- 微信二维码 `assets/wechat-qr.png`，点“显示二维码”才加载。
- 抖音号：`CONTACT.douyin` 写的是“AI不可言（抖音号 58069761911）”，显示在加我卡片里“也可以在抖音私信我”一行。
- 进群费用：一次性 99 元、无二次收费，写在“为什么是我”一节的黑色卡片、“几句实话”第三条、常见问题第 2 和第 6 条。
- 页面结构（从上到下）：首屏 → 怎么运作 → 客户要什么 → 一单八步（每步一句话，细节标“进群说”） → 为什么是我（半年、大几百单 + 三张能力卡 + 99 元）→ 几句实话 → 常见问题 → 加我。

## 上线三步

**第一步：把文件放到网上。** 三个选项，按推荐顺序：

1. 腾讯云 EdgeOne Pages（免费，国内有节点）。控制台新建 Pages 项目 → 直接上传本目录（或连 GitHub 仓库）→ 得到一个 `xxx.edgeone.app` 的临时地址。想绑自己的域名并走国内节点，域名要 ICP 备案；不备案就只能选“全球可用区（不含中国大陆）”，国内能打开但慢一些。
2. Cloudflare Pages（免费，不用备案）。国内大部分地区能打开，速度不稳定。
3. 买一台国内轻量服务器或用阿里云 OSS / 腾讯云 COS 静态托管 + 备案域名。最快最稳，但备案要一到三周，期间可以先用方案 1 的临时地址发。

GitHub Pages 在国内经常打不开，Vercel 的默认域名在国内被屏蔽，不推荐给抖音用户用。

**第二步：换域名。** 拿到正式地址后，在本目录打开 PowerShell 运行：

```powershell
.\set-domain.ps1 -Domain https://你的域名
```

它会把 `index.html`、`sitemap.xml`、`robots.txt`、`llms.txt` 里所有 `https://example.com` 换掉。不换的话分享大图、canonical、结构化数据里的地址都是错的。

**第三步：提交给搜索引擎。**

- 百度搜索资源平台（ziyuan.baidu.com）：添加站点 → 验证（文件验证：把它给你的 html 文件放到本目录即可）→ 提交 `sitemap.xml` → 普通收录里手动提交首页地址一次。
- Google Search Console 和 Bing Webmaster Tools：同样验证站点、提交 sitemap。
- 抖音搜索、豆包、百度 AI、Kimi、DeepSeek 这些 AI 搜索没有提交入口，靠它们的爬虫来抓；`robots.txt` 已经放开了 Bytespider（抖音/豆包）、Baiduspider、GPTBot、ClaudeBot、PerplexityBot 等。

## 抖音怎么把人带过来

抖音里的外链不能点，所以域名要短、好记、能念出来。做法：抖音主页简介写域名文字；视频口播和评论区置顶写“网页在主页”；私信里直接把网址发给对方。企业号认证后主页可以放可点击的官网链接。

## SEO / GEO 做了什么

- `<title>`、description、keywords、canonical、Open Graph、Twitter Card、`author`、`robots` 标签齐全，标题和描述里带“淘宝派单群”“AI 接单”“找店、进群、做单、结算”这些真实搜索词。
- JSON-LD 结构化数据：`WebSite`、`Person`（不可言）、`WebPage`、`HowTo`（八步）、`FAQPage`（八个问答）。AI 搜索最喜欢引用的就是问答和步骤。
- `llms.txt`：用一页纸把“这是谁、讲什么、不做什么、怎么进群”写给大模型看。
- 正文本身就是 GEO 友好的：一个 h1、八个 h2、问答用 `details/summary`、每个概念都有一句能直接引用的定义。
- 搜索词建议以后做内容时继续围绕：淘宝派单群怎么进、AI 接单是真的吗、PPT 接单一单多少钱、淘宝店铺招写手靠谱吗。

## 文案上的几个取舍（改文案前先看）

页面要发到抖音、要长期挂，所以下面这些故意没写，别再加回去：

- 没有收入承诺。不写“日入”“月入”“赚回来”“躺赚”“保证”“回本”这类词，也不放收款截图。“当天做两单赚回来”这种话是《广告法》里的保证性承诺，抖音审核也会拦，所以页面上写的是“群里派单的到手价上面都列了，这 99 元值不值，你对着算”——让读者自己得出同样的结论。
- 没有论文、作业、党政公文类的例子，并且明确写了不接、不教。
- 没有真实的第三方人名、店铺名、企业名。群名和客服名都是编的，客户需求里能认出来的细节改掉了。
- 没有教人“别说是 AI 做的”。页面只说“数据来源一条条核，核不出来的删掉”。
- 没有“评论区留微信会被限流”这类绕平台规则的话。
- 只在“几句实话”一节里讲一次风险和边界，页脚保留一行。

## 安全

- `<meta http-equiv="Content-Security-Policy">` 只允许加载本站的样式和脚本，禁止外链脚本、禁止表单提交、禁止 iframe 嵌入外站内容。JSON-LD 是数据块不会执行，不受影响。
- `referrer` 设为 `no-referrer`；`format-detection telephone=no` 防止 iOS 把微信号（手机号）自动变成拨号链接。
- 没有统计代码、没有表单、没有 cookie。
- 换到自己的服务器上时，建议在服务器层加 `Content-Security-Policy: frame-ancestors 'none'`、`X-Frame-Options: DENY`、`X-Content-Type-Options: nosniff`（`frame-ancestors` 只能用响应头设置）。

## 本地预览

```powershell
python -m http.server 4173
```

打开 <http://localhost:4173/>。没有 `python` 就用 `py -m http.server 4173`。
