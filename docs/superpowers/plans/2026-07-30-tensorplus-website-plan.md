# 张量无限科技官网重构 — 实施计划

> **For agentic workers:** 按 Task 顺序执行，每个 Task 完成后提交。

**Goal:** 从零搭建张量无限科技官网（Next.js 14 + Tailwind + Framer Motion），5个页面 + 联系表单API。

**Architecture:** Next.js 14 App Router，Tailwind CSS + CSS Variables 主题系统，Framer Motion 动效，Server Actions 处理表单。

**Tech Stack:** Next.js 14, React 18, Tailwind CSS 3, Framer Motion 11, Lucide React, Three.js/React Three Fiber, Noto Sans SC + Space Grotesk 字体

## Global Constraints

- 所有动效支持 `prefers-reduced-motion: reduce`
- 响应式：≥1280px 桌面 / 768-1279px 平板 / <768px 移动端
- 语义化 HTML，焦点可见
- 每个页面独立 title/description meta
- 主题色: `--accent: #0066FF`, `--accent-glow: #00E5FF`, `--warm: #F59E0B`

---

### Task 1: 项目脚手架

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`
- Create: `app/globals.css`, `app/layout.tsx`
- Create: `lib/utils.ts`

- [ ] `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm` 
- [ ] Install deps: `npm install framer-motion lucide-react @react-three/fiber @react-three/drei three`
- [ ] Install dev deps: `npm install -D @types/three`
- [ ] Configure `next.config.js` for image domains
- [ ] Create `app/globals.css` with Tailwind directives + CSS variables
- [ ] Create minimal `app/layout.tsx` with metadata + font loading + Nav + Footer shell
- [ ] Create `lib/utils.ts` with `cn()` helper (clsx + tailwind-merge pattern)
- [ ] Run `npm run dev` to verify

---

### Task 2: 设计令牌 & 主题系统

**Files:**
- Modify: `app/globals.css`
- Create: `components/ui/theme-provider.tsx`

- [ ] Define all CSS custom properties in `:root` (colors, spacing, radius, shadows)
- [ ] Add `.dark` class variant for deep section colors
- [ ] Add Tailwind extensions matching CSS vars
- [ ] Add `prefers-reduced-motion` global reset
- [ ] Create ThemeProvider (context for theme state if needed, otherwise CSS-only)

---

### Task 3: 布局组件 (Nav + Footer + Section)

**Files:**
- Create: `components/layout/nav.tsx`
- Create: `components/layout/footer.tsx`
- Create: `components/layout/section.tsx`
- Create: `components/layout/section-heading.tsx`
- Create: `components/layout/container.tsx`

- [ ] **Nav:** Fixed position, transparent bg on dark sections → solid bg on scroll. Logo + 5 nav links + CTA button. Mobile hamburger menu. Uses IntersectionObserver for theme-aware style switching.
- [ ] **Footer:** Dark bg, logo + description + quick links + contact info + copyright
- [ ] **Section:** Wrapper with `py-24 md:py-32`, centered max-width, accepts `dark`/`light`/`transition` variant props
- [ ] **SectionHeading:** Title + subtitle + decorative underline (accent gradient)
- [ ] **Container:** Simple max-w-7xl mx-auto px-4 wrapper

---

### Task 4: 基础 UI 组件

**Files:**
- Create: `components/ui/button.tsx`
- Create: `components/ui/card.tsx`
- Create: `components/ui/stat-badge.tsx`
- Create: `components/ui/glow-border.tsx`
- Create: `components/ui/scroll-reveal.tsx`

- [ ] **Button:** Primary (accent bg) / Secondary (outline) / Ghost variants, sizes sm/md/lg, loading state
- [ ] **Card:** Glass variant (backdrop-blur + semi-transparent bg for dark sections) + Solid variant (white bg + shadow for light sections), hover lift effect (4px + shadow)
- [ ] **StatBadge:** Large number (text-5xl, accent color) + label below, fadeInUp animation on scroll
- [ ] **GlowBorder:** Card wrapper with animated glowing border on hover (CSS gradient border + transition)
- [ ] **ScrollReveal:** Framer Motion wrapper, `fadeInUp` + stagger children, respects `prefers-reduced-motion`

---

### Task 5: Hero 区 (首页 Section 1)

**Files:**
- Create: `components/hero/hero-banner.tsx`
- Create: `components/hero/particle-background.tsx`

- [ ] **ParticleBackground:** Canvas-based particle system (Three.js or lightweight Canvas). Particles form neural network / point cloud patterns. Slow float animation. Static gradient fallback for mobile.
- [ ] **HeroBanner:** Full viewport height, dark bg, centered content. ParticleBackground as absolute overlay. Tagline with typewriter/fade-in animation. Two CTA buttons (primary: 查看方案 → section scroll, secondary: 预约演示 → /contact). Scroll-down indicator at bottom.

---

### Task 6: 首页内容区 (Sections 2-5)

**Files:**
- Modify: `app/page.tsx`
- Create: `components/home/product-cards.tsx`
- Create: `components/home/industry-carousel.tsx`
- Create: `components/home/stats-section.tsx`
- Create: `components/home/cta-banner.tsx`

- [ ] **ProductCards:** Two large cards side by side (stack on mobile). Each: icon + product name + short description + "了解更多 →" link. Glass variant on transition bg.
- [ ] **IndustryCarousel:** Horizontal scroll cards for 5 industries (光伏/电力/林业/石油/农业). Icon + name + short scenario text.
- [ ] **StatsSection:** Three StatBadges in row: `<0.1mm 3D成像精度`, `99.8% 识别准确率`, `5+ 落地行业`. Count-up animation on scroll into view.
- [ ] **CTABanner:** Dark section, heading "准备好升级您的自动化方案？" + two buttons: [预约产品演示] [下载技术白皮书]
- [ ] Compose all sections in `app/page.tsx`

---

### Task 7: 产品详情页 (3D感知方案 + 全地形机器人)

**Files:**
- Create: `app/3d-perception/page.tsx`
- Create: `app/robot/page.tsx`
- Create: `components/product/product-hero.tsx`
- Create: `components/product/feature-grid.tsx`
- Create: `components/product/spec-table.tsx`
- Create: `components/product/scenario-showcase.tsx`
- Create: `components/product/product-cta.tsx`

Both pages share the same components with different data.

- [ ] **ProductHero:** Dark bg, product name + tagline + placeholder visual (gradient bg with icon, replaceable with real image)
- [ ] **FeatureGrid:** 3-column grid, each: icon + title + description + micro stat. Props-driven, different content per product.
- [ ] **SpecTable:** Clean table with parameter rows. `param: value` format with zebra striping.
- [ ] **ScenarioShowcase:** Left-right alternating layout. Image placeholder + scenario name + description. 3-4 scenarios per product.
- [ ] **ProductCTA:** Compact dark CTA with form/button for tech spec download or demo booking.

---

### Task 8: 关于我们页

**Files:**
- Create: `app/about/page.tsx`

- [ ] Company intro section: mission/vision paragraph + placeholder image area
- [ ] Timeline: 3-5 milestone nodes (founded, first product, key deployments, etc.) with year + description
- [ ] Address card: formatted address with map placeholder

---

### Task 9: 联系我们页 + API

**Files:**
- Create: `app/contact/page.tsx`
- Create: `app/api/contact/route.ts`
- Create: `components/contact/contact-form.tsx`
- Create: `components/contact/contact-info.tsx`

- [ ] **ContactForm:** Name (required), Company, Email (required, validate format), Message (required, min 10 chars). Submit button with loading state. Success/error toast.
- [ ] **ContactInfo:** Card with: email, two phone numbers, address. Copy-to-clipboard on email/phone click.
- [ ] **API Route:** POST handler. Validate inputs server-side. Send email via Nodemailer to sales@tensorplus.cn. Return JSON `{success: true}` or `{error: "message"}`.
- [ ] Bottom reassurance: "我们会在24小时内回复您的咨询"

---

### Task 10: 全局打磨

**Files:**
- Modify: `app/layout.tsx`
- Modify: Various component files

- [ ] Add per-page metadata (title, description, og:image) to each page
- [ ] Responsive audit: test all pages at 375px, 768px, 1280px, 1440px
- [ ] Animation audit: verify `prefers-reduced-motion` works
- [ ] Accessibility: keyboard nav through nav menu, focus rings visible, semantic heading hierarchy
- [ ] Performance: `next build` succeeds, check bundle size
- [ ] Final polish: loading states, 404 page, smooth scroll behavior
- [ ] Run `npm run build` — fix any errors

---

*Plan complete. 10 tasks, execute sequentially.*
