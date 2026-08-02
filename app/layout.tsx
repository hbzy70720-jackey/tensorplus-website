import type { Metadata } from "next";
import { Space_Grotesk, Noto_Sans_SC } from "next/font/google";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import PageTracker from "@/components/analytics/page-tracker";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "TensorPlus 张量无限 — 高精度3D感知与户外作业机器人",
    template: "%s — TensorPlus 张量无限",
  },
  description:
    "北京张量无限科技有限公司，专注于户外机器人高精度3D感知方案与户外作业机器人。亚毫米级3D相机、物体识别算法、自主导航SLAM，为光伏、电力、林业、石油、农业提供开箱即用的智能解决方案。",
  keywords: [
    "3D感知",
    "机器人",
    "高精度相机",
    "SLAM",
    "自主导航",
    "物体识别",
    "工业机器人",
    "视觉识别",
    "张量无限",
  ],
  openGraph: {
    title: "TensorPlus 张量无限 — 高精度3D感知与户外作业机器人",
    description: "亚毫米级3D相机 + 户外作业机器人，为工业场景而生。",
    url: "https://www.tensorplus.cn",
    siteName: "TensorPlus 张量无限",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className={`${spaceGrotesk.variable} ${notoSansSC.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <PageTracker />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
