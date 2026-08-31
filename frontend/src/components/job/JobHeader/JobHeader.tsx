"use client";

import {
  BadgeCheck,
  Building2,
  MapPin,
} from "lucide-react";

export interface JobHeaderProps {
  company: string;
  companyLogo?: string;
  title: string;
  salary: string;
  location: string;
  verified?: boolean;
}

export default function JobHeader({
  company,
  companyLogo,
  title,
  salary,
  location,
  verified,
}: JobHeaderProps) {
  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        sm:p-8
      "
    >
      {/* Background decoration */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-52
          w-52
          rounded-full
          bg-blue-50
          blur-3xl
        "
      />

      <div
        className="
          relative
          flex
          flex-col
          gap-6
          sm:flex-row
          sm:items-start
        "
      >
        {/* Company Logo */}

        {companyLogo ? (
          <img
            src={companyLogo}
            alt={company}
            className="
              h-[72px]
              w-[72px]
              shrink-0
              rounded-2xl
              border
              border-slate-200
              bg-white
              object-cover
            "
          />
        ) : (
          <div
            className="
              flex
              h-[72px]
              w-[72px]
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              text-slate-500
            "
          >
            <Building2 size={30} />
          </div>
        )}

        {/* Main */}

        <div className="min-w-0 flex-1">
          {/* Company */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <span
              className="
                text-sm
                font-bold
                text-slate-500
              "
            >
              {company}
            </span>

            {verified && (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  bg-blue-50
                  px-2.5
                  py-1
                  text-xs
                  font-bold
                  text-blue-600
                "
              >
                <BadgeCheck size={14} />

                企业认证
              </span>
            )}
          </div>

          {/* Title */}

          <h1
            className="
              mt-3
              text-2xl
              font-black
              leading-tight
              tracking-tight
              text-slate-950
              sm:text-3xl
              lg:text-4xl
            "
          >
            {title}
          </h1>

          {/* Salary */}

          <div
            className="
              mt-6
              text-2xl
              font-black
              tracking-tight
              text-blue-600
              sm:text-3xl
            "
          >
            {salary}
          </div>

          {/* Location */}

          <div
            className="
              mt-4
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-500
            "
          >
            <MapPin
              size={17}
              className="shrink-0"
            />

            <span>{location}</span>
          </div>
        </div>
      </div>
    </section>
  );
}