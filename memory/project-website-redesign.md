---
name: tensorplus-website-redesign
description: 张量无限官网重构项目，工业机器人+视觉识别赛道
metadata:
  type: project
---

# 张量无限科技官网重构项目

**项目路径:** d:\MyProject\Website
**状态:** 开发中 — 已完成主要页面，待部署预览
**最后更新:** 2026-08-02

## 项目概述

TensorPlus（北京张量无限科技有限公司）官网。Next.js 16 + Tailwind CSS 4 + Prisma 5 + SQLite。

- [设计规格书](../docs/superpowers/specs/2026-07-30-tensorplus-website-redesign.md)
- [实施计划](../docs/superpowers/plans/2026-07-30-tensorplus-website-plan.md)
- [后台管理设计](../docs/superpowers/specs/2026-07-31-contact-admin-design.md)
- [后台管理计划](../docs/superpowers/plans/2026-07-31-contact-admin-plan.md)

## 已完成功能

### 官网前端
- 首页：Hero粒子背景 + 产品卡片 + 行业横滑 + 数据指标 + CTA
- 产品页：3D感知方案 + 全地形机器人（含场景图片轮播组件）
- 关于我们：使命愿景 + 时间轴 + 地址
- 联系我们：表单 + 联系信息卡片（微信公众号二维码）
- 404页面
- **图片轮播**: ImageCarousel 组件，支持多点导航、左右箭头、键盘切换、懒加载

### 后台管理系统
- 数据库：Prisma 5 + SQLite，Submission / NoteEntry / VisitRecord 三个模型
- 认证：JWT + httpOnly Cookie，密码登录
- 表单管理 API：列表查询(分页+搜索+筛选) / 状态更新 / 删除 / CSV导出
- **备注历史**: 每条提交支持多条备注，显示历史时间线，POST 新增 + GET 列表
- **访问追踪**: PageTracker 客户端组件自动记录每次页面访问（路径/IP/UA/来源/停留时长），IP 地理位置解析到省份粒度，心跳+sendBeacon 保证停留时长准确
- **访问记录管理**: `/admin/visits` 页面，支持按 IP/地区/页面/日期范围筛选，CSV 导出，按日期删除旧记录
- 页面：登录页 / 仪表盘 / 访问记录页

### 图片存放方案
- 图片目录：`public/images/perception/` 和 `public/images/robot/`
- 详细命名指南见 `public/images/README.md`
- 每个场景支持 1~N 张图片，下方小圆点导航切换

## 2026-08-02 更新：机器人页面重构

### 变更内容
- **新增** `components/product/tech-highlights.tsx` — 技术亮点组件，图文左右交替布局，支持图标子项 + ImageCarousel
- **合并** "核心能力" + "应用场景" 两个板块为统一的 "技术亮点" 板块
- **删除** 农业/林业/石油电力三个行业场景、全地形通过能力卡片
- **Hero tagline** 更新为 "3D感知 + 自主导航 + 自主执行"
- **已上传图片**:
  - 3D感知：`perception-1.png` ~ `perception-4.png`
  - 自主导航：`navigation-1.jpg`、`navigation-2.webp`
  - 自主执行：`execution-1.webp`、`execution-2.webp`

### 部署
- **公网预览**: `https://tensorplus-website.netlify.app`（Netlify 免费部署）
- **GitHub**: `https://github.com/hbzy70720-jackey/tensorplus-website`，push 即自动部署
- **Netlify 配置**: `netlify.toml`（Node 20 + Prisma generate + @netlify/plugin-nextjs）
- **前台页面**全部正常访问，**后台管理**需要云数据库（SQLite 在 Serverless 上无法持久化）

### 待完成
- **后台数据库**: Netlify Serverless 不支持 SQLite 本地文件，需切换到 Turso（免费 SQLite 云服务）或其他云数据库
- **环境变量**: `ADMIN_PASSWORD`、`JWT_SECRET`、`DATABASE_URL` 需在部署平台配置

## 技术栈
- Next.js 16.2.12 (App Router + Turbopack)
- Tailwind CSS 4
- Framer Motion 11
- Prisma 5.22.0 + SQLite
- jose (JWT)
- lucide-react

## 关键注意事项
- Prisma 版本锁定在 5.22.0（VS Code 扩展与 Prisma 7 有兼容问题，会自动回写 `url` 字段）
- 数据库文件：`prisma/dev.db`，已加入 `.gitignore`
- 环境变量在 `.env.local`：`ADMIN_PASSWORD`、`JWT_SECRET`、`DATABASE_URL`
- 管理后台地址：`/admin/login`，默认密码：`tensorplus2024`
- 所有后台 fetch 调用必须加 `credentials: "include"` 才能发送 auth cookie
- `email` 字段在数据库中为可选（`String?`），CSV导出和前端渲染需处理 null
- Git 仓库：`https://github.com/hbzy70720-jackey/tensorplus-website`，master 分支

## 路由清单
```
/                         首页 (SSG)
/3d-perception            3D感知方案 (SSG)
/robot                    全地形机器人 (SSG)
/about                    关于我们 (SSG)
/contact                  联系我们 (SSG)
/admin                    后台仪表盘 (SSG)
/admin/login              后台登录 (SSG)
/api/contact              POST 联系表单
/api/admin/login           POST 登录
/api/admin/logout          POST 退出
/api/admin/submissions     GET 提交列表
/api/admin/submissions/[id] PATCH/DELETE 单条操作
/api/admin/submissions/export GET CSV导出
```
