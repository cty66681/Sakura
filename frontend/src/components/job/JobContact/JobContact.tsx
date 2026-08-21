"use client";

import {
  User,
  Phone,
  Mail,
} from "lucide-react";

export interface JobContactProps {
  contactName: string;
  phone: string;
  email: string;
}

export default function JobContact({
  contactName,
  phone,
  email,
}: JobContactProps) {
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

        <div className="flex items-center gap-3">
          <User
            size={20}
            className="text-blue-500"
          />

          <div>
            <div className="text-sm text-slate-500">
              联系人
            </div>

            <div className="font-medium text-slate-900">
              {contactName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone
            size={20}
            className="text-green-500"
          />

          <div>
            <div className="text-sm text-slate-500">
              电话
            </div>

            <div className="font-medium text-slate-900">
              {phone}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail
            size={20}
            className="text-red-500"
          />

          <div>
            <div className="text-sm text-slate-500">
              邮箱
            </div>

            <div className="font-medium text-slate-900">
              {email}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}