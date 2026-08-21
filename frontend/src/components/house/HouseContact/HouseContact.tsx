"use client";

import {
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";

export interface HouseContactProps {
  name: string;
  company: string;
  phone: string;
  email: string;
}

export default function HouseContact({
  name,
  company,
  phone,
  email,
}: HouseContactProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
      "
    >
      <h2
        className="
          mb-6
          text-lg
          font-semibold
          text-slate-900
        "
      >
        联系方式
      </h2>

      <div className="space-y-5">

        <div>
          <div className="text-lg font-semibold text-slate-900">
            {name}
          </div>

          <div className="text-sm text-slate-500">
            {company}
          </div>
        </div>

        <div className="space-y-3">

          <div className="flex items-center gap-3">
            <Phone size={18} />
            <span>{phone}</span>
          </div>

          <div className="flex items-center gap-3">
            <Mail size={18} />
            <span>{email}</span>
          </div>

        </div>

        <button
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2

            rounded-xl

            bg-green-500

            py-3

            font-medium
            text-white

            transition

            hover:bg-green-600
          "
        >
          <MessageCircle size={18} />
          联系房东
        </button>

      </div>
    </div>
  );
}