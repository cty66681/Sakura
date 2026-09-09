import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
} from "lucide-react";

import Container from "@/components/layout/Container";

import JobHeader from "@/components/job/JobHeader";
import JobInfo from "@/components/job/JobInfo";
import JobBenefit from "@/components/job/JobBenefit";
import JobDescription from "@/components/job/JobDescription";
import JobContact from "@/components/job/JobContact";

import { jobs } from "@/data/jobs";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    fromPage?: string;
  }>;
}

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 获取单个职位详情
|
| GET /api/jobs/:id
|
| Response:
| {
|   job: {
|     id,
|     company,
|     companyLogo,
|     title,
|     salary,
|     location,
|     verified,
|     employmentType,
|     remote,
|     experience,
|     education,
|     language,
|     workingHours,
|     holiday,
|     benefits,
|     description,
|     contactName,
|     phone,
|     email,
|     publishTime,
|     views,
|     tags
|   }
| }
|
| 当前阶段使用 "@/data/jobs" Mock 数据。
|
|--------------------------------------------------------------------------
*/

export default async function JobDetailPage({
  params,
  searchParams
}: Props) {
  const { id } = await params;

  const { fromPage } =
  await searchParams;

  const page = Number(fromPage);

  const returnHref =
    Number.isInteger(page) &&
    page > 1
      ? `/jobs?page=${page}#job-results`
      : "/jobs#job-results";

  const job = jobs.find(
    (item) => item.id === Number(id)
  );

  if (!job) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ================================================= */}
      {/* TOP */}
      {/* ================================================= */}

      <section
        className="
          relative
          overflow-hidden
          border-b
          border-slate-200
          bg-white
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-40
            h-[380px]
            w-[380px]
            rounded-full
            bg-blue-100/60
            blur-3xl
          "
        />

        <Container>
          <div className="relative py-6">
            <Link
              href={returnHref}
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-slate-500
                transition
                hover:text-slate-950
              "
            >
              <ArrowLeft size={16} />

              返回工作列表
            </Link>

            <div
              className="
                mt-5
                flex
                flex-wrap
                items-center
                gap-2
                text-xs
                font-semibold
                text-slate-400
              "
            >
              <BriefcaseBusiness
                size={14}
              />

              <span>Sakura Jobs</span>

              <span>·</span>

              <span>{job.location}</span>

              <span>·</span>

              <span>{job.publishTime}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <Container>
        <div
          className="
            grid
            gap-8
            py-8
            lg:grid-cols-[minmax(0,1fr)_320px]
            lg:items-start
            lg:py-10
          "
        >
          {/* LEFT */}

          <div className="min-w-0 space-y-6">
            <JobHeader
              company={job.company}
              companyLogo={job.companyLogo}
              title={job.title}
              salary={job.salary}
              location={job.location}
              verified={job.verified}
            />

            <JobInfo
              employmentType={
                job.employmentType
              }
              remote={job.remote}
              experience={job.experience}
              education={job.education}
              language={job.language}
              workingHours={
                job.workingHours
              }
              holiday={job.holiday}
            />
            <div
              className="
                rounded-[24px]
                border
                border-blue-100
                bg-blue-50/50
                p-6
                shadow-sm
              "
            >
              <p
                className="
                  text-sm
                  font-black
                  text-slate-900
                "
              >
                外国人求职信息
              </p>

              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  gap-2
                "
              >
                {job.foreignerFriendly && (
                  <JobFeatureTag>
                    外国人友好
                  </JobFeatureTag>
                )}

                {job.chineseAvailable && (
                  <JobFeatureTag>
                    中文可
                  </JobFeatureTag>
                )}

                {job.visaSupport && (
                  <JobFeatureTag>
                    签证支援
                  </JobFeatureTag>
                )}

                {job.beginnerFriendly && (
                  <JobFeatureTag>
                    未经验可
                  </JobFeatureTag>
                )}
              </div>
            </div>

            <JobBenefit
              benefits={job.benefits}
            />

            <JobDescription
              description={
                job.description
              }
            />
          </div>

          {/* RIGHT */}

          <aside
            className="
              space-y-5
              lg:sticky
              lg:top-24
            "
          >
            <JobContact
              contactName={
                job.contactName
              }
              phone={job.phone}
              email={job.email}
            />

            {/* Job summary */}

            <div
              className="
                rounded-[24px]
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
              "
            >
              <p
                className="
                  text-sm
                  font-black
                  text-slate-900
                "
              >
                职位信息
              </p>

              <div className="mt-4 space-y-4">
                <InfoRow
                  label="雇佣类型"
                  value={
                    job.employmentType
                  }
                />

                <InfoRow
                  label="工作方式"
                  value={job.remote}
                />

                <InfoRow
                  label="经验要求"
                  value={job.experience}
                />

                <InfoRow
                  label="日语要求"
                  value={job.language}
                />

                <InfoRow
                  label="浏览"
                  value={`${job.views} 次`}
                />
              </div>
            </div>

            {/* Safety */}

            <div
              className="
                rounded-[24px]
                border
                border-amber-200
                bg-amber-50
                p-5
              "
            >
              <p
                className="
                  text-sm
                  font-black
                  text-amber-900
                "
              >
                求职提醒
              </p>

              <p
                className="
                  mt-2
                  text-xs
                  leading-6
                  text-amber-800/80
                "
              >
                求职过程中如果遇到要求提前付款、
                购买指定商品、提供异常敏感信息等情况，
                建议先确认企业和职位真实性。
              </p>

              <Link
                href="/scam"
                className="
                  mt-4
                  inline-flex
                  text-xs
                  font-bold
                  text-amber-900
                  transition
                  hover:underline
                "
              >
                查看 Sakura 避坑信息 →
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-5
        border-b
        border-slate-100
        pb-3
        last:border-0
        last:pb-0
      "
    >
      <span
        className="
          shrink-0
          text-xs
          text-slate-400
        "
      >
        {label}
      </span>

      <span
        className="
          text-right
          text-xs
          font-bold
          text-slate-700
        "
      >
        {value}
      </span>
    </div>
  );
}

function JobFeatureTag({
  children,
}: {
  children: string;
}) {
  return (
    <span
      className="
        inline-flex
        items-center
        rounded-full
        border
        border-blue-200
        bg-white
        px-3
        py-1.5
        text-xs
        font-bold
        text-blue-700
      "
    >
      {children}
    </span>
  );
}