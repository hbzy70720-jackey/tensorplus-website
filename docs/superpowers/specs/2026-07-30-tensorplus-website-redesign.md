# 张量无限科技官网重构 — 设计规格说明书

**日期:** 2026-07-30  
**状态:** 已确认，待实施

---

## 1. 项目概述

### 1.1 背景

重构 tensorplus.cn 官网。原站基于华为云建站平台（Vue.js SPA），结构简单（9 Row + 16 Module），缺乏自主可控性和品牌差异化。新官网定位工业机器人 + 视觉识别赛道，要求高大上、科技感强的品牌形象。

### 1.2 目标

- **品牌展示 (70%)**：技术实力展示、产品方案呈现、行业应用案例
- **营销转化 (30%)**：预约演示表单、联系咨询入口、技术白皮书下载

### 1.3 产品线

1. **户外机器人高精度3D感知方案** — 3D相机（亚毫米级）+ 物体识别算法，落地光伏/电力/林业/石油
2. **全地形灵巧机器人** — 自主导航（SLAM+避障）+ 自主执行（任务规划+机械臂引导），落地农业/林业/石油/电力

---

## 2. 技术架构

### 2.1 选型

| 层 | 选型 |
|----|------|
| 框架 | Next.js 14 App Router |
| 样式 | Tailwind CSS + CSS Variables |
| 动效 | Framer Motion |
| 3D/Hero | Three.js + React Three Fiber |
| 字体 | Space Grotesk (标题) + Noto Sans SC (正文) |
| 图标 | Lucide React |
| 表单 | Server Actions → Nodemailer |
| 部署 | Vercel / 阿里云 OSS + FC |

### 2.2 目录结构

```
/app
  layout.tsx        (全局布局)
  page.tsx          (首页, SSG)
  /3d-perception/page.tsx
  /robot/page.tsx
  /about/page.tsx
  /contact/page.tsx
  /api/contact/route.ts
/components
  /ui               (Button, Card, Badge, Input...)
  /layout           (Nav, Footer, Section, Container)
  /hero             (HeroBanner, ParticleBg)
  /product          (ProductCard, SpecTable, FeatureGrid)
  /effects          (ScrollReveal, ParallaxLayer, GlowBorder)
/lib
/public
/styles
```

---

## 3. 设计方向：混合沉浸式 (方案C)

### 3.1 设计理念

- **明暗交替叙事**：首页/产品Hero深色，内容区浅色，CTA区深色收尾
- **核心逻辑**：深色"秀肌肉"（视觉冲击），浅色"建信任"（可读性），节奏张弛有度

### 3.2 设计令牌

```css
:root {
  --bg-deep:     #090D16;
  --bg-dark:     #0F172A;
  --bg-light:    #F8FAFC;
  --bg-white:    #FFFFFF;
  --accent:      #0066FF;
  --accent-glow: #00E5FF;
  --warm:        #F59E0B;
  --text-dark:   #0F172A;
  --text-light:  #E2E8F0;
  --text-muted:  #64748B;
  --section-gap: 120px;
  --radius-card: 16px;
  --radius-btn:  8px;
}
```

### 3.3 字体

- 标题: Space Grotesk (weight: 500/600/700)
- 正文: Noto Sans SC (weight: 400/500/700)
- 后备: system-ui, -apple-system, sans-serif

---

## 4. 页面设计

### 4.1 首页 (Home)

五段式叙事，深→过渡→浅→浅→深：

| Section | 背景 | 内容 |
|---------|------|------|
| Section 1: Hero | 深色 `#090D16` | 3D粒子背景（点云/神经网络可视化），Tagline"让机器看懂世界，让机器人自主行走"，[查看方案↓] [预约演示→] |
| Section 2: 产品方案概览 | 深→浅过渡 | 两张产品卡片：3D感知方案 + 全地形机器人，发光描边hover |
| Section 3: 行业应用 | 浅色 `#F8FAFC` | 5个行业图标横滑卡片：光伏、电力、林业、石油、农业 |
| Section 4: 核心优势数字 | 浅色 | 3个StatBadge：<0.1mm 3D成像精度 / 99.8% 识别准确率 / 5+ 落地行业 |
| Section 5: CTA | 深色 | "准备好升级您的自动化方案？" [预约产品演示] [下载技术白皮书] |

### 4.2 3D感知方案页

| Section | 内容 |
|---------|------|
| Hero | 产品名 + 一句话定位 + 产品图 |
| 核心能力 | 3列网格：高精度3D相机 / 物体识别算法 / 抗强光干扰 |
| 技术规格 | Datasheet风格参数表 |
| 应用场景 | 左右交替：光伏组件检测 / 原木测量 / 支架定位 |
| CTA | "获取技术规格书" 表单 |

### 4.3 全地形机器人页

同 4.2 模板结构，内容替换为机器人产品线。

| Section | 内容 |
|---------|------|
| Hero | 产品名 + 定位 + 产品图 |
| 核心能力 | 3列：自主导航 / 自主执行 / 3D感知引导 |
| 技术规格 | Datasheet风格参数表 |
| 应用场景 | 农业 / 林业 / 石油 / 电力 |
| CTA | "预约机器人演示" 表单 |

### 4.4 关于我们

- 公司简介 + 使命愿景
- 发展里程碑时间轴 (3-5节点)
- 地址 + 地图

### 4.5 联系我们

- 左右分栏：联系表单（姓名/公司/邮箱/需求） + 联系信息卡片
- 邮箱: sales@tensorplus.cn
- 电话: 13581638071 / 18611406172
- 地址: 北京市海淀区成府路45号中关村智造大街G座2层206

---

## 5. 核心组件

| 组件 | 功能 | 状态 |
|------|------|------|
| Nav | Fixed导航，深色透明→滚动后实色背景 | |
| Footer | Logo + 简介 + 快速链接 + 联系方式 + Copyright | |
| Section | 统一容器，padding + max-width 约束 | |
| SectionHeading | 标题 + 副标题 + 装饰下划线 | |
| Card | 磨砂玻璃态（深色区）/ 白底阴影态（浅色区） | |
| GlowBorder | 发光描边hover效果 | |
| SpecTable | 产品技术参数表 | |
| StatBadge | 大数字 + 描述指标 | |
| CTABanner | 深色CTA横幅，可全局复用 | |

---

## 6. 动效规范

| 层级 | 触发 | 效果 | 用途 |
|------|------|------|------|
| L1 | hover | 卡片微抬4px + 阴影扩散 | 可点击卡片 |
| L2 | scroll into view | fadeInUp, stagger 0.1s | Section内容入场 |
| L3 | scroll | 视差 0.5x | Hero/过渡区 |
| L4 | 持续 | 粒子Canvas / 浮动光斑 | Hero深色区 |
| L5 | route change | 300ms fade + 位移 | 页面切换 |

**约束**: 所有动效支持 `prefers-reduced-motion: reduce`。

---

## 7. 响应式策略

| 断点 | 布局变化 |
|------|----------|
| ≥1280px | 完整桌面布局，max-width: 1280px |
| 768-1279px | 平板：产品卡片2列→1列，Section间距缩小 |
| <768px | 移动端：Nav改为汉堡菜单，卡片全宽，字体缩小，Hero粒子降级为静态渐变 |

---

## 8. 表单处理

- 联系表单：Server Actions → POST `/api/contact`
- 后端：Nodemailer 发送邮件通知到 sales@tensorplus.cn
- 前端：提交后显示成功Toast，失败显示错误提示
- 校验：前端 + 后端双重校验（姓名必填、邮箱格式、需求至少10字）

---

## 9. 非功能性需求

- **性能**: Lighthouse Performance ≥ 90，所有图片使用 Next.js Image 优化，WebP 优先
- **可访问性**: 语义化HTML，焦点可见，`prefers-reduced-motion` 支持
- **SEO**: 每个页面独立 title/description，Open Graph标签，结构化数据
- **兼容**: Chrome/Firefox/Safari/Edge 最新两个版本

---

*规格说明书结束。进入实施阶段。*
