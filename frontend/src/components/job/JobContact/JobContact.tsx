"use client";

import {
  Copy,
  Mail,
  Phone,
  UserRound,
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
  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // 浏览器不支持 Clipboard API 时不影响其他功能
    }
  }

  return (
    <section
      className="
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* Header */}

      <div
        className="
          border-b
          border-slate-100
          bg-slate-950
          px-5
          py-5
        "
      >
        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-[0.16em]
            text-blue-300
          "
        >
          CONTACT
        </p>

        <h2
          className="
            mt-1
            text-lg
            font-black
            text-white
          "
        >
          联系招聘方
        </h2>

        <p
          className="
            mt-2
            text-xs
            leading-5
            text-slate-400
          "
        >
          联系前建议确认职位信息和企业真实性
        </p>
      </div>

      {/* Contact information */}

      <div className="p-5">
        <div className="space-y-3">
          {/* Contact */}

          <ContactRow
            icon={UserRound}
            label="联系人"
            value={contactName}
          />

          {/* Phone */}

          <ContactRow
            icon={Phone}
            label="电话"
            value={phone}
            action={
              <button
                type="button"
                onClick={() => copyText(phone)}
                aria-label="复制电话号码"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-900
                "
              >
                <Copy size={14} />
              </button>
            }
          />

          {/* Email */}

          <ContactRow
            icon={Mail}
            label="邮箱"
            value={email}
            action={
              <button
                type="button"
                onClick={() => copyText(email)}
                aria-label="复制邮箱"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-900
                "
              >
                <Copy size={14} />
              </button>
            }
          />
        </div>

        {/* Actions */}

        <div
          className="
            mt-5
            grid
            grid-cols-2
            gap-2
          "
        >
          <a
            href={`tel:${phone}`}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-3
              py-3
              text-sm
              font-bold
              text-white
              transition
              hover:bg-blue-700
            "
          >
            <Phone size={15} />

            电话联系
          </a>

          <a
            href={`mailto:${email}`}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              py-3
              text-sm
              font-bold
              text-slate-700
              transition
              hover:border-slate-300
              hover:bg-slate-50
            "
          >
            <Mail size={15} />

            发送邮件
          </a>
        </div>

        <p
          className="
            mt-4
            text-center
            text-[11px]
            leading-5
            text-slate-400
          "
        >
          Sakura 不参与招聘双方的实际雇佣及付款流程
        </p>
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  action,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className="
        flex
        min-w-0
        items-center
        gap-3
        rounded-xl
        bg-slate-50
        p-3
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-white
          text-slate-600
          shadow-sm
        "
      >
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="
            text-[11px]
            font-medium
            text-slate-400
          "
        >
          {label}
        </p>

        <p
          className="
            mt-0.5
            truncate
            text-sm
            font-bold
            text-slate-800
          "
          title={value}
        >
          {value || "未填写"}
        </p>
      </div>

      {action}
    </div>
  );
}