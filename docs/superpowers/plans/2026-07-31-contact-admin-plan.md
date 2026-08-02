# 表单数据库存储 + 后台管理 — 实施计划

> **For agentic workers:** 按 Task 顺序执行，每个 Task 完成后提交。最终验证 `npm run build`。

**Goal:** 为联系表单和预约演示添加 SQLite 数据库存储，并实现带密码认证的后台管理面板（列表+搜索+筛选+状态流转+备注+CSV导出+删除）。

**Architecture:** Prisma + SQLite 持久化 → JWT Cookie 鉴权 → Route Handler API → Server/Client Component 混合的管理面板

**Tech Stack:** Prisma 6 + SQLite, jose (JWT), Next.js 16 App Router, Tailwind CSS 4, Lucide React

## Global Constraints

- 所有组件使用项目 CSS 变量（`--accent`, `--bg-deep`, `--text-dark` 等）
- 响应式：≥1280px 桌面 / 768-1279px 平板 / <768px 移动端
- 语义化 HTML，焦点可见
- 交互、注释使用中文，代码命名使用英文
- YAGNI：不做不必要的抽象，每个组件专注单一职责

---

### Task 1: 依赖安装 + Prisma 初始化 + 环境配置

**Files:**
- Create: `prisma/schema.prisma`
- Create: `.env.local`
- Create: `.gitignore`
- Modify: `package.json` (deps added via `npm install`)

**Interfaces:**
- Produces: `Submission` 数据模型（id, name, email, company, message, source, status, notes, createdAt, updatedAt）

- [ ] **Step 1: 安装依赖**

```bash
npm install prisma @prisma/client jose
```

- [ ] **Step 2: 初始化 Prisma**

```bash
npx prisma init --datasource-provider sqlite
```

- [ ] **Step 3: 编写 schema**

修改 `prisma/schema.prisma`：

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Submission {
  id        Int      @id @default(autoincrement())
  name      String
  email     String
  company   String?
  message   String
  source    String   @default("contact")
  status    String   @default("new")
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

- [ ] **Step 4: 创建 `.env.local`**

```bash
echo "DATABASE_URL=\"file:./prisma/dev.db\"" > .env.local
echo "ADMIN_PASSWORD=changeme123" >> .env.local
echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env.local
```

- [ ] **Step 5: 创建 `.gitignore`**

```gitignore
# dependencies
/node_modules

# next.js
/.next/
/out/

# env
.env*.local

# database
/prisma/dev.db
/prisma/dev.db-journal
```

- [ ] **Step 6: 生成 Prisma Client + 创建数据库迁移**

```bash
npx prisma migrate dev --name init
```

Run: `npx prisma migrate dev --name init`
Expected: 生成 `prisma/migrations/` 目录和 `prisma/dev.db`

---

### Task 2: Prisma 单例 (lib/db.ts)

**Files:**
- Create: `lib/db.ts`

**Interfaces:**
- Produces: `export default prisma` — PrismaClient 单例

- [ ] **Step 1: 创建 lib/db.ts**

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

---

### Task 3: JWT 认证工具 (lib/auth.ts)

**Files:**
- Create: `lib/auth.ts`

**Interfaces:**
- Produces:
  - `signToken(): Promise<string>` — 签发 24h JWT
  - `verifyToken(token: string): Promise<{ role: string } | null>` — 验证 JWT
  - `setAuthCookie(token: string): Promise<string>` — 返回 Set-Cookie 头值
  - `getAuthCookieName(): string` — 返回 cookie 名 "admin_token"

- [ ] **Step 1: 创建 lib/auth.ts**

```typescript
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-me"
);

const COOKIE_NAME = "admin_token";
const EXPIRES_IN = "24h";

export function getAuthCookieName(): string {
  return COOKIE_NAME;
}

export async function signToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(secret);
}

export async function verifyToken(
  token: string
): Promise<{ role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { role: string };
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`;
}

export function clearAuthCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
```

---

### Task 4: 鉴权中间件 (middleware.ts)

**Files:**
- Create: `middleware.ts`

**Interfaces:**
- Consumes: `lib/auth.ts` — `getAuthCookieName`, `verifyToken`
- Produces: 拦截 `/admin/*`，无有效 token 重定向 `/admin/login`

- [ ] **Step 1: 创建 middleware.ts**

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthCookieName, verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 只处理 /admin 路径
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // 登录页和 API 不拦截（API 自行验证）
  if (pathname === "/admin/login") return NextResponse.next();

  // 验证 token
  const token = request.cookies.get(getAuthCookieName())?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

---

### Task 5: 修改联系表单 API 写入数据库

**Files:**
- Modify: `app/api/contact/route.ts`

**Interfaces:**
- Consumes: `lib/db.ts` — `prisma`
- Produces: POST → 写入 Submission 表 → `{ success: true }`

- [ ] **Step 1: 重写 app/api/contact/route.ts**

```typescript
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, message, source } = body;

    // Server-side validation
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "姓名不能为空" },
        { status: 400 }
      );
    }

    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "请提供有效的邮箱地址" },
        { status: 400 }
      );
    }

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length < 10
    ) {
      return NextResponse.json(
        { error: "需求描述至少需要10个字" },
        { status: 400 }
      );
    }

    // 写入数据库
    await prisma.submission.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        company: company?.trim() || null,
        message: message.trim(),
        source: source === "demo" ? "demo" : "contact",
      },
    });

    return NextResponse.json(
      { success: true, message: "感谢您的咨询，我们会在24小时内回复。" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "服务器错误，请稍后再试" },
      { status: 500 }
    );
  }
}
```

---

### Task 6: 后台登录 API

**Files:**
- Create: `app/api/admin/login/route.ts`

**Interfaces:**
- Consumes: `lib/auth.ts` — `signToken`, `setAuthCookie`
- Produces: POST `{ password }` → 验证密码 → set cookie → `{ success: true }` | `{ error }`

- [ ] **Step 1: 创建 app/api/admin/login/route.ts**

```typescript
import { NextResponse } from "next/server";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "请输入密码" },
        { status: 400 }
      );
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "密码错误" },
        { status: 401 }
      );
    }

    const token = await signToken();
    const cookie = setAuthCookie(token);

    const response = NextResponse.json({ success: true });
    response.headers.append("Set-Cookie", cookie);
    return response;
  } catch {
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}
```

---

### Task 7: 后台登录页

**Files:**
- Create: `app/admin/login/page.tsx`

**Interfaces:**
- Produces: 密码输入表单 → POST `/api/admin/login` → 跳转 `/admin`

- [ ] **Step 1: 创建 app/admin/login/page.tsx**

```typescript
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin");
      } else {
        setError(data.error || "登录失败");
      }
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-deep)] p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
            <span className="gradient-text">Tensor</span>Plus
          </h1>
          <p className="mt-2 text-sm text-gray-400">后台管理系统</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-800 bg-white/5 p-6 backdrop-blur"
        >
          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              管理密码
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3 text-sm text-white placeholder-gray-500 transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              placeholder="请输入管理密码"
            />
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                登录中...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                登录
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

### Task 8: 后台布局 (独立壳)

**Files:**
- Create: `app/admin/layout.tsx`

**Interfaces:**
- Produces: 独立布局（无 Nav/Footer），包含顶部导航栏（Logo + 退出按钮）

- [ ] **Step 1: 创建 app/admin/layout.tsx**

```typescript
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "后台管理 — TensorPlus",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-light)]">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/admin"
            className="font-[family-name:var(--font-heading)] text-lg font-bold"
          >
            <span className="gradient-text">Tensor</span>Plus{" "}
            <span className="text-[var(--text-muted)]">· 后台</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-dark)]"
            >
              查看官网 ↗
            </Link>
            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="rounded-lg px-3 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-red-50 hover:text-red-600"
              >
                退出
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Content */}
      <main>{children}</main>
    </div>
  );
}
```

---

### Task 9: 后台提交列表 API

**Files:**
- Create: `app/api/admin/submissions/route.ts`

**Interfaces:**
- Consumes: `lib/db.ts` — `prisma`, `lib/auth.ts` — `getAuthCookieName`, `verifyToken`
- Produces: GET `?search=&status=&source=&page=&pageSize=` → `{ submissions: Submission[], total, page, pageSize }`

- [ ] **Step 1: 创建 app/api/admin/submissions/route.ts**

```typescript
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthCookieName, verifyToken } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// 鉴权 helper
async function authenticate(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(getAuthCookieName())?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return !!payload;
}

export async function GET(request: NextRequest) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const source = searchParams.get("source") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize")) || 20));

  // 构建查询条件
  const where: Prisma.SubmissionWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { company: { contains: search } },
    ];
  }

  if (status && ["new", "processing", "replied"].includes(status)) {
    where.status = status;
  }

  if (source && ["contact", "demo"].includes(source)) {
    where.source = source;
  }

  const [submissions, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.submission.count({ where }),
  ]);

  return NextResponse.json({
    submissions,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
```

---

### Task 10: 单条提交 CRUD API

**Files:**
- Create: `app/api/admin/submissions/[id]/route.ts`

**Interfaces:**
- Consumes: `lib/db.ts`, `lib/auth.ts`
- Produces: PATCH → 更新 status/notes, DELETE → 删除记录

- [ ] **Step 1: 创建 app/api/admin/submissions/[id]/route.ts**

```typescript
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthCookieName, verifyToken } from "@/lib/auth";

async function authenticate(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(getAuthCookieName())?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return !!payload;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status, notes } = body;

  const data: Record<string, string> = {};
  if (status && ["new", "processing", "replied"].includes(status)) {
    data.status = status;
  }
  if (notes !== undefined && typeof notes === "string") {
    data.notes = notes;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "无有效更新字段" }, { status: 400 });
  }

  const submission = await prisma.submission.update({
    where: { id: Number(id) },
    data,
  });

  return NextResponse.json({ submission });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.submission.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
```

---

### Task 11: CSV 导出 API + 退出登录 API

**Files:**
- Create: `app/api/admin/submissions/export/route.ts`
- Create: `app/api/admin/logout/route.ts`

**Interfaces:**
- Consumes: `lib/db.ts`, `lib/auth.ts`
- Produces: GET → CSV 文件下载; POST → 清除 cookie 跳转登录

- [ ] **Step 1: 创建 CSV 导出 API**

```typescript
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthCookieName, verifyToken } from "@/lib/auth";
import { Prisma } from "@prisma/client";

async function authenticate(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(getAuthCookieName())?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return !!payload;
}

export async function GET(request: NextRequest) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const source = searchParams.get("source") || "";

  const where: Prisma.SubmissionWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { company: { contains: search } },
    ];
  }
  if (status && ["new", "processing", "replied"].includes(status)) {
    where.status = status;
  }
  if (source && ["contact", "demo"].includes(source)) {
    where.source = source;
  }

  const submissions = await prisma.submission.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  // 生成 CSV
  const header = "姓名,邮箱,公司,需求描述,来源,状态,提交时间,内部备注\n";
  const statusMap: Record<string, string> = {
    new: "新提交",
    processing: "处理中",
    replied: "已回复",
  };

  const rows = submissions
    .map((s) => {
      return [
        `"${s.name.replace(/"/g, '""')}"`,
        `"${s.email.replace(/"/g, '""')}"`,
        `"${(s.company || "").replace(/"/g, '""')}"`,
        `"${s.message.replace(/"/g, '""')}"`,
        s.source === "demo" ? "预约演示" : "联系我们",
        statusMap[s.status] || s.status,
        s.createdAt.toISOString(),
        `"${(s.notes || "").replace(/"/g, '""')}"`,
      ].join(",");
    })
    .join("\n");

  const csv = "﻿" + header + rows; // BOM for Excel 中文兼容

  const date = new Date().toISOString().split("T")[0];
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="submissions-export-${date}.csv"`,
    },
  });
}
```

- [ ] **Step 2: 创建退出登录 API**

```typescript
import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.redirect(new URL("/admin/login", "http://localhost"));
  response.headers.append("Set-Cookie", clearAuthCookie());
  return response;
}
```

---

### Task 12: 状态标签组件

**Files:**
- Create: `components/admin/status-badge.tsx`

**Interfaces:**
- Consumes: `status: "new" | "processing" | "replied"`
- Produces: 彩色圆点标签

- [ ] **Step 1: 创建 components/admin/status-badge.tsx**

```typescript
import { cn } from "@/lib/utils";

const config = {
  new: { label: "新提交", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  processing: { label: "处理中", bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
  replied: { label: "已回复", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
};

interface StatusBadgeProps {
  status: "new" | "processing" | "replied";
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const c = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        c.bg,
        c.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}
```

---

### Task 13: 筛选栏组件

**Files:**
- Create: `components/admin/filter-bar.tsx`

**Interfaces:**
- Consumes:
  - Props: `search`, `status`, `source`, `onSearchChange`, `onStatusChange`, `onSourceChange`, `onExport`
- Produces: 搜索输入框 + 状态下拉 + 来源下拉 + 导出按钮

- [ ] **Step 1: 创建 components/admin/filter-bar.tsx**

```typescript
"use client";

import { Search, Download, Filter } from "lucide-react";

interface FilterBarProps {
  search: string;
  status: string;
  source: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onExport: () => void;
  exportLoading?: boolean;
}

export default function FilterBar({
  search,
  status,
  source,
  onSearchChange,
  onStatusChange,
  onSourceChange,
  onExport,
  exportLoading = false,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* 搜索 */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜索姓名、邮箱、公司..."
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
      </div>

      {/* 状态筛选 */}
      <div className="relative">
        <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-300 py-2.5 pl-10 pr-8 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] sm:w-auto"
        >
          <option value="">全部状态</option>
          <option value="new">新提交</option>
          <option value="processing">处理中</option>
          <option value="replied">已回复</option>
        </select>
      </div>

      {/* 来源筛选 */}
      <select
        value={source}
        onChange={(e) => onSourceChange(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] sm:w-auto"
      >
        <option value="">全部来源</option>
        <option value="contact">联系我们</option>
        <option value="demo">预约演示</option>
      </select>

      {/* 导出 */}
      <button
        onClick={onExport}
        disabled={exportLoading}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-[var(--text-dark)] transition-colors hover:bg-gray-50 disabled:opacity-50"
      >
        <Download className="h-4 w-4" />
        {exportLoading ? "导出中..." : "导出CSV"}
      </button>
    </div>
  );
}
```

---

### Task 14: 提交数据表格组件

**Files:**
- Create: `components/admin/submission-table.tsx`

**Interfaces:**
- Consumes:
  - Props: `submissions: Submission[]`, `onStatusChange`, `onDelete`, `onSelect`, `selectedId`
  - `components/admin/status-badge.tsx`
- Produces: 数据表格，行点击展开详情

- [ ] **Step 1: 创建 components/admin/submission-table.tsx**

```typescript
"use client";

import { ChevronDown, Mail, Trash2 } from "lucide-react";
import StatusBadge from "@/components/admin/status-badge";
import { cn } from "@/lib/utils";

interface Submission {
  id: number;
  name: string;
  email: string;
  company: string | null;
  message: string;
  source: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

interface SubmissionTableProps {
  submissions: Submission[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onStatusChange: (id: number, status: string) => void;
  onDelete: (id: number) => void;
}

const sourceLabel: Record<string, string> = {
  contact: "联系我们",
  demo: "预约演示",
};

const nextStatus: Record<string, string> = {
  new: "processing",
  processing: "replied",
  replied: "new",
};

export default function SubmissionTable({
  submissions,
  selectedId,
  onSelect,
  onStatusChange,
  onDelete,
}: SubmissionTableProps) {
  if (submissions.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-[var(--text-muted)]">暂无提交数据</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              姓名
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              邮箱
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] md:table-cell">
              公司
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] sm:table-cell">
              来源
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              状态
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] lg:table-cell">
              时间
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <tr
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={cn(
                "cursor-pointer border-b border-gray-50 transition-colors hover:bg-gray-50/50",
                selectedId === s.id && "bg-blue-50/30"
              )}
            >
              <td className="px-4 py-3 text-sm font-medium text-[var(--text-dark)]">
                {s.name}
              </td>
              <td className="px-4 py-3">
                <a
                  href={`mailto:${s.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline"
                >
                  <Mail className="h-3 w-3" />
                  {s.email}
                </a>
              </td>
              <td className="hidden px-4 py-3 text-sm text-[var(--text-muted)] md:table-cell">
                {s.company || "-"}
              </td>
              <td className="hidden px-4 py-3 sm:table-cell">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-[var(--text-muted)]">
                  {sourceLabel[s.source] || s.source}
                </span>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={s.status as "new" | "processing" | "replied"} />
              </td>
              <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-[var(--text-muted)] lg:table-cell">
                {new Date(s.createdAt).toLocaleDateString("zh-CN", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(s.id, nextStatus[s.status]);
                    }}
                    className="rounded px-2 py-1 text-xs text-[var(--accent)] transition-colors hover:bg-blue-50"
                  >
                    → {s.status === "new" ? "处理中" : s.status === "processing" ? "已回复" : "还原"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("确定删除该提交？")) {
                        onDelete(s.id);
                      }
                    }}
                    className="rounded px-1.5 py-1 text-xs text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <ChevronDown
                    className={cn(
                      "ml-1 h-4 w-4 text-gray-300 transition-transform",
                      selectedId === s.id && "rotate-180"
                    )}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

### Task 15: 详情面板组件

**Files:**
- Create: `components/admin/detail-panel.tsx`

**Interfaces:**
- Consumes:
  - Props: `submission: Submission | null`, `onSaveNotes: (id, notes) => void`, `onClose: () => void`
- Produces: 展开详情面板，显示完整留言 + 备注编辑

- [ ] **Step 1: 创建 components/admin/detail-panel.tsx**

```typescript
"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import StatusBadge from "@/components/admin/status-badge";

interface Submission {
  id: number;
  name: string;
  email: string;
  company: string | null;
  message: string;
  source: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

interface DetailPanelProps {
  submission: Submission | null;
  onSaveNotes: (id: number, notes: string) => void;
  onClose: () => void;
}

export default function DetailPanel({
  submission,
  onSaveNotes,
  onClose,
}: DetailPanelProps) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setNotes(submission?.notes || "");
  }, [submission]);

  if (!submission) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text-dark)]">
          提交详情
        </h3>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Meta */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs text-[var(--text-muted)]">姓名</p>
          <p className="text-sm font-medium text-[var(--text-dark)]">
            {submission.name}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)]">邮箱</p>
          <a
            href={`mailto:${submission.email}`}
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            {submission.email}
          </a>
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)]">公司</p>
          <p className="text-sm text-[var(--text-dark)]">
            {submission.company || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)]">状态</p>
          <StatusBadge
            status={submission.status as "new" | "processing" | "replied"}
          />
        </div>
      </div>

      {/* Message */}
      <div className="mb-6">
        <p className="mb-2 text-xs text-[var(--text-muted)]">需求描述</p>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-dark)]">
            {submission.message}
          </p>
        </div>
      </div>

      {/* Notes */}
      <div>
        <p className="mb-2 text-xs text-[var(--text-muted)]">内部备注</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          placeholder="添加内部备注..."
        />
        <button
          onClick={() => onSaveNotes(submission.id, notes)}
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700"
        >
          <Save className="h-4 w-4" />
          保存备注
        </button>
      </div>
    </div>
  );
}
```

---

### Task 16: 后台仪表盘主页

**Files:**
- Create: `app/admin/page.tsx`

**Interfaces:**
- Consumes: `components/admin/filter-bar`, `components/admin/submission-table`, `components/admin/detail-panel`
- Produces: 完整仪表盘页面

- [ ] **Step 1: 创建 app/admin/page.tsx**

```typescript
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  return <AdminDashboard />;
}
```

- [ ] **Step 2: 创建 components/admin/admin-dashboard.tsx (Client Component)**

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import FilterBar from "@/components/admin/filter-bar";
import SubmissionTable from "@/components/admin/submission-table";
import DetailPanel from "@/components/admin/detail-panel";

interface Submission {
  id: number;
  name: string;
  email: string;
  company: string | null;
  message: string;
  source: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (source) params.set("source", source);
    params.set("page", String(page));
    params.set("pageSize", "20");

    const res = await fetch(`/api/admin/submissions?${params}`);
    if (res.ok) {
      const data = await res.json();
      setSubmissions(data.submissions);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    }
    setLoading(false);
  }, [search, status, source, page]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // 搜索/筛选变化时回到第一页
  useEffect(() => {
    setPage(1);
  }, [search, status, source]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) fetchSubmissions();
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      if (selectedId === id) setSelectedId(null);
      fetchSubmissions();
    }
  };

  const handleSaveNotes = async (id: number, notes: string) => {
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    if (res.ok) fetchSubmissions();
  };

  const handleExport = async () => {
    setExportLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (source) params.set("source", source);

    const res = await fetch(`/api/admin/submissions/export?${params}`);
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        res.headers
          .get("Content-Disposition")
          ?.match(/filename="(.+)"/)?.[1] || "export.csv";
      a.click();
      URL.revokeObjectURL(url);
    }
    setExportLoading(false);
  };

  const selectedSubmission =
    submissions.find((s) => s.id === selectedId) || null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-dark)] sm:text-3xl">
          表单提交管理
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          共 {total} 条提交记录
        </p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <FilterBar
          search={search}
          status={status}
          source={source}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onSourceChange={setSource}
          onExport={handleExport}
          exportLoading={exportLoading}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--accent)]" />
          <p className="mt-4 text-sm text-[var(--text-muted)]">加载中...</p>
        </div>
      ) : (
        <SubmissionTable
          submissions={submissions}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            上一页
          </button>
          <span className="px-4 text-sm text-[var(--text-muted)]">
            第 {page} / {totalPages} 页
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      )}

      {/* Detail Panel */}
      {selectedSubmission && (
        <div className="mt-6">
          <DetailPanel
            submission={selectedSubmission}
            onSaveNotes={handleSaveNotes}
            onClose={() => setSelectedId(null)}
          />
        </div>
      )}
    </div>
  );
}
```

---

### Task 17: Build 验证 + 最终检查

**Files:**
- Modify: `app/api/admin/logout/route.ts` (修复 redirect URL)

- [ ] **Step 1: 修复退出登录 API 的 redirect URL**

将 `app/api/admin/logout/route.ts` 中的硬编码 `http://localhost` 替换为动态取 origin：

```typescript
import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_URL || "http://localhost:3001"));
  response.headers.append("Set-Cookie", clearAuthCookie());
  return response;
}
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: ✅ Compiled successfully, all routes listed, zero errors.

- [ ] **Step 3: 验证路由表**

确认以下路由都在 build output 中:
- `/admin` (static)
- `/admin/login` (static)
- `/api/contact` (dynamic)
- `/api/admin/login` (dynamic)
- `/api/admin/submissions` (dynamic)
- `/api/admin/submissions/[id]` (dynamic)
- `/api/admin/submissions/export` (dynamic)
- `/api/admin/logout` (dynamic)

---

*Plan complete. 17 tasks, execute sequentially.*
