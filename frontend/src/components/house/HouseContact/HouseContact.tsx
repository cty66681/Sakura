"use client";

import {
  Building2,
  Copy,
  Mail,
  Phone,
  UserRound,
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
  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard API 不可用时，不影响电话和邮件功能
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
            text-cyan-300
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
          联系房源负责人
        </h2>

        <p
          className="
            mt-2
            text-xs
            leading-5
            text-slate-400
          "
        >
          咨询空室、看房时间以及初期费用等信息
        </p>
      </div>

      <div className="p-5">
        {/* Person */}

        <div
          className="
            rounded-2xl
            border
            border-slate-100
            bg-slate-50
            p-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white
                text-slate-600
                shadow-sm
              "
            >
              <UserRound size={18} />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-xs
                  font-medium
                  text-slate-400
                "
              >
                房源负责人
              </p>

              <p
                className="
                  mt-0.5
                  truncate
                  text-sm
                  font-black
                  text-slate-900
                "
              >
                {name || "未填写"}
              </p>
            </div>
          </div>

          {company && (
            <div
              className="
                mt-3
                flex
                items-center
                gap-2
                border-t
                border-slate-200/70
                pt-3
                text-xs
                text-slate-500
              "
            >
              <Building2
                size={14}
                className="shrink-0"
              />

              <span className="truncate">
                {company}
              </span>
            </div>
          )}
        </div>

        {/* Contact information */}

        <div className="mt-4 space-y-2">
          <ContactRow
            icon={Phone}
            label="电话"
            value={phone}
            onCopy={() => copyText(phone)}
          />

          <ContactRow
            icon={Mail}
            label="邮箱"
            value={email}
            onCopy={() => copyText(email)}
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

            电话咨询
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

            邮件咨询
          </a>
        </div>

        {/* Notice */}

        <p
          className="
            mt-4
            text-center
            text-[11px]
            leading-5
            text-slate-400
          "
        >
          Sakura 仅提供房源信息展示，
          实际看房、签约及付款请与房源负责人确认
        </p>
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  onCopy,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  onCopy: () => void;
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

      {value && (
        <button
          type="button"
          onClick={onCopy}
          aria-label={`复制${label}`}
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-slate-400
            transition
            hover:bg-white
            hover:text-slate-900
          "
        >
          <Copy size={14} />
        </button>
      )}
    </div>
  );
}