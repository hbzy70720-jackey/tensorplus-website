# 表单数据库存储 + 后台管理 — 设计规格说明书

**日期:** 2026-07-31
**状态:** 已确认，待实施

---

## 1. 项目概述

### 1.1 背景

当前 `/api/contact` 仅 `console.log` 输出表单数据，无持久化存储。需要将联系表单和预约演示的提交存入数据库，并提供后台管理面板供运营人员查看、处理、导出。

### 1.2 目标

- 表单提交持久化到 SQLite 数据库
- 后台管理面板：查看、搜索、筛选、状态流转、备注、CSV 导出、删除
- 简单的密码认证保护后台访问

---

## 2. 技术架构

| 层 | 选型 |
|----|------|
| ORM | Prisma + SQLite |
| 认证 | 环境变量密码 + JWT Cookie |
| 前端 | Server Components + Client Components |
| API | Route Handlers |

---

## 3. 数据模型

```prisma
model Submission {
  id        Int      @id @default(autoincrement())
  name      String
  email     String
  company   String?
  message   String
  source    String   @default("contact")  // "contact" | "demo"
  status    String   @default("new")      // "new" | "processing" | "replied"
  notes     String?                      // 内部备注
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 来源枚举

| source | 含义 | 来源页面 |
|--------|------|----------|
| `contact` | 联系我们表单 | `/contact` |
| `demo` | 预约演示 | Hero / CTA Banner 等 |

### 状态枚举

| status | 含义 |
|--------|------|
| `new` | 新提交，待处理 |
| `processing` | 处理中 |
| `replied` | 已回复 |

---

## 4. 认证方案

- 环境变量 `ADMIN_PASSWORD` 存储管理密码
- 登录成功 → 服务端签发 JWT（HS256），存入 httpOnly + secure + sameSite cookie，有效期 24h
- 使用 JWT 库 `jose`（Edge 兼容）
- Middleware 拦截 `/admin/*`（除 `/admin/login`），验证 cookie
- 无有效 cookie → 307 重定向到 `/admin/login`

---

## 5. API 路由设计

### 5.1 联系表单（修改现有）

**POST `/api/contact`** — 提交联系表单

- Request: `{ name, email, company?, message, source? }`
- 校验：name 必填、email 格式、message ≥10 字
- 写入数据库，source 默认 `"contact"`
- Response: `{ success: true }` 或 `{ error: "msg" }`

### 5.2 后台管理

**POST `/api/admin/login`**
- Request: `{ password }`
- 校验密码 → 签发 JWT → set cookie
- Response: `{ success: true }` 或 `{ error: "密码错误" }`

**GET `/api/admin/submissions`**
- Query: `?search=&status=&source=&page=&pageSize=`
- 返回分页列表 + 总数

**PATCH `/api/admin/submissions/[id]`**
- Request: `{ status?, notes? }`
- 更新单条记录的状态或备注

**DELETE `/api/admin/submissions/[id]`**
- 硬删除单条记录

**GET `/api/admin/submissions/export`**
- Query: `?search=&status=&source=` (同列表筛选条件)
- 生成 CSV 文件下载

---

## 6. 后台管理页面

### 6.1 页面路由

| 路由 | 页面 |
|------|------|
| `/admin/login` | 登录页 |
| `/admin` | 仪表盘主页（提交列表） |

### 6.2 登录页 (`/admin/login`)

- 居中卡片：输入密码 → 提交 → 成功后跳转 `/admin`
- 错误提示
- 暗色背景（与品牌一致）

### 6.3 仪表盘主页 (`/admin`)

**筛选栏**
- 搜索框：按姓名/邮箱/公司模糊匹配
- 状态下拉：全部 / 新提交 / 处理中 / 已回复
- 来源下拉：全部 / 联系我们 / 预约演示
- CSV 导出按钮

**数据表格**
| 列 | 说明 |
|----|------|
| 姓名 | 提交者姓名 |
| 邮箱 | 可点击 mailto: |
| 公司 | 可能为空 |
| 来源 | 标签：联系我们 / 预约演示 |
| 状态 | 彩色标签：新(蓝) / 处理中(黄) / 已回复(绿) |
| 提交时间 | 格式化日期 |
| 操作 | 状态切换 + 展开详情 + 删除 |

**详情面板**
- 点击行展开：完整留言内容 + 内部备注编辑区
- 备注编辑：textarea + 保存按钮

**CSV 导出**
- 导出当前筛选条件下的所有结果
- 列：姓名、邮箱、公司、需求描述、来源、状态、提交时间、备注
- 文件名：`submissions-export-YYYY-MM-DD.csv`

---

## 7. 文件清单

```
新增:
  prisma/schema.prisma                      — 数据模型
  middleware.ts                             — 鉴权中间件
  app/admin/layout.tsx                      — 后台布局（无 Nav/Footer，独立壳）
  app/admin/page.tsx                        — 仪表盘主页
  app/admin/login/page.tsx                  — 登录页
  app/api/admin/login/route.ts              — 登录 API
  app/api/admin/submissions/route.ts        — 列表查询 API
  app/api/admin/submissions/[id]/route.ts   — 单条更新/删除 API
  app/api/admin/submissions/export/route.ts — CSV 导出 API
  components/admin/submission-table.tsx     — 数据表格
  components/admin/status-badge.tsx         — 状态标签
  components/admin/filter-bar.tsx           — 搜索+筛选栏
  components/admin/detail-panel.tsx         — 详情面板
  lib/auth.ts                               — JWT 签发/验证工具
  lib/db.ts                                 — Prisma 单例

修改:
  app/api/contact/route.ts                  — 改为写入数据库
  package.json                              — 添加 prisma, jose 等依赖
```

---

## 8. 非功能性需求

- **安全**: API 路由鉴权一致，JWT 24h 过期，密码不硬编码（环境变量）
- **UI 一致性**: 管理后台复用项目 CSS 变量（颜色/圆角/字体），保持品牌一致
- **数据库**: Prisma migrate 生成 SQLite 文件，`.gitignore` 排除数据库文件
- **Edge 兼容**: jose 替代 jsonwebtoken，确保在 Edge Runtime 可用

---

*规格说明书结束。进入实施阶段。*
