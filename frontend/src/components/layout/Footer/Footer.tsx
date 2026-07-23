import Link from "next/link";

import Container from "../Container";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-white">

      <Container>

        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">

          {/* Logo */}

          <div>

            <h2 className="text-2xl font-bold text-blue-600">

              Sakura

            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500">

              在日华人的一站式生活平台。

            </p>

          </div>

          {/* 产品 */}

          <div>

            <h3 className="font-semibold">

              产品

            </h3>

            <ul className="mt-5 space-y-3 text-slate-500">

              <li><Link href="/jobs">工作</Link></li>

              <li><Link href="/house">房源</Link></li>

              <li><Link href="/schools">升学</Link></li>

              <li><Link href="/experience">经验</Link></li>

              <li><Link href="/scam">避坑</Link></li>

              <li><Link href="/ai">AI工具</Link></li>

            </ul>

          </div>

          {/* 社区 */}

          <div>

            <h3 className="font-semibold">

              社区

            </h3>

            <ul className="mt-5 space-y-3 text-slate-500">

              <li>论坛</li>

              <li>动态</li>

              <li>发布信息</li>

            </ul>

          </div>

          {/* 帮助 */}

          <div>

            <h3 className="font-semibold">

              帮助

            </h3>

            <ul className="mt-5 space-y-3 text-slate-500">

              <li>联系我们</li>

              <li>意见反馈</li>

              <li>隐私政策</li>

              <li>用户协议</li>

            </ul>

          </div>

          {/* 关于 */}

          <div>

            <h3 className="font-semibold">

              关于

            </h3>

            <ul className="mt-5 space-y-3 text-slate-500">

              <li>关于 Sakura</li>

              <li>GitHub</li>

              <li>RoadMap</li>

            </ul>

          </div>

        </div>

        <div className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">

          © 2026 Sakura. All rights reserved.

        </div>

      </Container>

    </footer>
  );
}