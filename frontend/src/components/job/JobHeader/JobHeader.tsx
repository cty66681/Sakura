"use client";

import Image from "next/image";
import { BadgeCheck, MapPin } from "lucide-react";

export interface JobHeaderProps {
  company: string;
  companyLogo: string;
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
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-8
      "
    >
      <div className="flex items-start gap-6">

        <Image
          src={companyLogo}
          alt={company}
          width={72}
          height={72}
          className="rounded-2xl border border-slate-200"
        />

        <div className="flex-1">

          <div className="flex items-center gap-3">

            <h1
              className="
                text-3xl
                font-bold
                text-slate-900
              "
            >
              {title}
            </h1>

            {verified && (
              <BadgeCheck
                size={22}
                className="text-blue-500"
              />
            )}

          </div>

          <div
            className="
              mt-3
              text-xl
              font-semibold
              text-slate-800
            "
          >
            {company}
          </div>

          <div
            className="
              mt-4
              flex
              flex-wrap
              items-center
              gap-6
            "
          >
            <span
              className="
                text-2xl
                font-bold
                text-red-500
              "
            >
              {salary}
            </span>

            <div
              className="
                flex
                items-center
                gap-2
                text-slate-600
              "
            >
              <MapPin size={18} />
              {location}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}