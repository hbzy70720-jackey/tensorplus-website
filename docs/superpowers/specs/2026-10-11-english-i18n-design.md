# 英文版国际化（i18n）设计文档

- 日期：2026-10-11
- 状态：待用户 review
- 范围：www.tensorplus.cn 在原中文站上新增英文版

## 1. 背景与目标

公司官网（www.tensorplus.cn）已完成中文版，现要出海做国际化，在**原网站**上增加英文版。

目标：
- 首页右上角提供「中文 / English」切换。
- 首页默认进入中文；访问 `/en` 前缀进入英文。
- 英文版内容与中文版保持一致，翻译为**高质量整句意译**（非逐字硬翻）。
- 公司英文全称：**Beijing TensorPlus Technology Co., Ltd.**

## 2. 现状梳理

- 技术栈：Next.js 16 App Router + React 19 + Prisma（SQLite）+ Tailwind CSS 4 + framer-motion / tiptap / lucide-react。
- 内容分两类：
  - **静态文案**：硬编码在 ~25 个组件/页面（nav、footer、hero、首页四块、about、contact、3d-perception、robot、product 系列、section-heading 等）。
  - **动态内容**：案例存于 `CaseStudy` 表（title/slug/description/content 富文本/coverImage/industry/customer/deliveryDate/tags），后台可编辑。
- 路由：`/`、`/3d-perception`、`/robot`、`/cases`、`/cases/[slug]`、`/about`、`/contact`；`/admin`（后台，内部用）；`/api`。
- SEO：`app/sitemap.ts`、`app/robots.ts`、百度站长验证、`metadata` 硬编码。
- 已知 i18n 需特别处理的点：
  - `industry` 目前是中文字符串（光伏/林业/石油/电力），并被用作 `industryColors` 的 key 与筛选器选项。
  - 根布局 `<html lang="zh-CN">`、中文字体 `Noto_Sans_SC`、`metadata`（含 OG `locale: zh_CN`）写死。
  - `nav.tsx` 的 `isDarkPage = pathname === "/"` 需兼容 `/en`。

## 3. 已确认的决策

| 决策点 | 结论 |
|---|---|
| URL 方案 | `/en` 子目录（同域名 www.tensorplus.cn/en/...） |
| 语言跳转 | 默认中文，不做浏览器语言自动跳转；用 cookie 记忆选择 |
| 案例英文维护 | `CaseStudy` 表加英文字段，后台可编辑，已有案例由 AI 预填翻译 |
| 公司英文名 | Beijing TensorPlus Technology Co., Ltd. |
| 翻译 review | AI 全部翻译完成后，一次性提交用户 review |
| 后台（/admin） | 保持中文，仅案例表单加英文输入区 |

## 4. 架构设计

### 4.1 路由与目录结构

公共页面迁移到 `[lang]` 段下：

```
app/
  [lang]/
    layout.tsx            # locale 感知根布局（lang / 字体 / metadata）
    page.tsx              # 首页
    3d-perception/page.tsx
    robot/page.tsx
    cases/page.tsx
    cases/[slug]/page.tsx
    about/page.tsx
    contact/page.tsx
  admin/ ...              # 不动，保持中文
  api/ ...                # 不动
middleware.ts             # 新增：解析 locale
```

- `middleware.ts`：因 `[lang]` 段要求 URL 带前缀，middleware 将无前缀路径 rewrite 到 `lang=zh`（`/` → `/zh`，`/cases` → `/zh/cases`），`/en/*` 保持 `lang=en` 原样通过。默认中文，不依据 Accept-Language 跳转。
- `lang` 通过 `params.lang` 传入各 page/layout。
- 内部链接统一走 locale 感知的链接 helper，避免每处手写前缀。

### 4.2 词典与取文案机制

```
lib/i18n/
  locales/zh.ts           # 中文词典（从现有硬编码文案提取）
  locales/en.ts           # 英文词典（AI 意译）
  index.ts                # getDictionary(lang)、LocaleProvider、useLocale
  config.ts               # locales 元信息、defaultLocale='zh'、语言切换映射
```

- 组件用 `useDict()` 取文案，所有硬编码中文收口到 `zh.ts`。
- 不引入 next-intl 等框架：两语言、内容中等，自建字典最可控。

### 4.3 数据模型变更（Prisma + migration）

`CaseStudy` 增加可空英文字段（未填回退中文）：

```prisma
titleEn        String?
descriptionEn  String?
contentEn      String?    // tiptap HTML，英文富文本
customerEn     String?
industryEn     String?
tagsEn         String     @default("[]")
```

- slug 复用：同一案例，`/en/cases/[slug]` 与 `/cases/[slug]` 是同一数据。
- `industry` 中英映射抽常量表（光伏↔Solar、林业↔Forestry、石油↔Oil & Gas、电力↔Power），`industryColors` 与筛选器改用它。
- 后台 `case-form.tsx` 增加英文输入区；已有案例英文由 AI 预填。

### 4.4 布局与 metadata

- `[lang]/layout.tsx`：`<html lang={lang === 'en' ? 'en' : 'zh-CN'}>`；字体按 locale 选择（英文页只加载 Space_Grotesk，中文页保留 Noto_Sans_SC）。
- `generateMetadata({ params })` 按 `params.lang` 返回对应语言 title/description/keywords/OG（`locale: 'en_US'` vs `'zh_CN'`）。
- 修 `nav.tsx`：`isDarkPage` 判断兼容 `"/en"`。

### 4.5 SEO

- 各页面 `generateMetadata` 加 `alternates.canonical` + `alternates.languages`（zh/en 互指）→ 生成 hreflang。
- `sitemap.ts` 输出双语 URL + alternates。
- 保留百度验证（中文站）；补 Google Search Console 验证 + GA4（出海必需，可放后置阶段）。

### 4.6 语言切换器

- Nav 右上角（「预约演示」旁）放**下拉式**语言切换器（点击当前语言，展开「中文 / English」列表，便于后续扩展更多语种）。
- 切换时做当前路径 locale 映射：`/en/cases/foo` ↔ `/cases/foo`；从中文页点 English 加 `/en` 前缀，从英文页点中文去前缀。
- 不持久化、不自动跳转（默认中文）。

## 5. 翻译与术语表

流程：AI 建术语表（用户确认）→ AI 整句意译 → 一次性交用户 review。

术语表（初稿，待翻译阶段细化确认）：

| 中文 | 英文 |
|---|---|
| 3D感知方案 | 3D Perception |
| 户外作业机器人 | Outdoor Operation Robots |
| 亚毫米级 | sub-millimeter |
| 核心产品方案 | Core Solutions |
| 行业应用场景 | Industry Applications |
| 核心优势 | Key Advantages |
| 客户案例 | Customer Stories / Case Studies |
| 关于我们 | About Us |
| 预约演示 | Book a Demo |

## 6. 分阶段落地计划

| 阶段 | 内容 | 产出 |
|---|---|---|
| 1 | 路由骨架（`[lang]` + middleware）+ 词典机制 + 语言切换器 | 英文页可跑，文案暂空/回退中文 |
| 2 | 静态文案：nav/footer/首页/about/contact/3d-perception/robot 英文词典 | 整站英文可用 |
| 3 | 案例英文字段 + 后台表单 + 已有案例预填 | 案例中英双语 |
| 4 | SEO（hreflang/sitemap/Google 验证/GA4）+ 验收 | 可上线 |

## 7. 测试与验收标准

- [ ] `/` 与 `/en` 均可访问，`html lang`、字体、metadata 正确。
- [ ] 语言切换器在任意页面（含 `/cases/[slug]`）切换后路径映射正确、内容语言正确。
- [ ] 英文页无残留中文文案（除备案号等法定信息）。
- [ ] 案例英文字段未填时正确回退中文。
- [ ] `hreflang`、`sitemap`、`canonical` 输出正确。
- [ ] `npm run build` 通过，无类型错误。
- [ ] 后台 /admin 功能不受影响。

## 8. 风险与注意事项

- **Next.js 16 特化**：AGENTS.md 提示本项目 Next.js 与通用认知有差异；实现前需阅读 `node_modules/next/dist/docs/` 确认 i18n、middleware、generateMetadata 的具体 API（当前环境 node_modules 未安装）。
- **字体体积**：英文页与中文页字体子集不同，注意避免重复加载。
- **备案信息**：footer 中的 ICP/公安备案号保留原文（用户已确认）。
- **术语一致性**：翻译需严格按术语表，避免同一概念多译。
