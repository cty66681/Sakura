"use client";

import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import MobileMenu from "./MobileMenu";
import { useRouter } from "next/navigation";

import {
  Bell,
  Globe,
  Search,
} from "lucide-react";


export default function HeaderActions() {
  const router = useRouter();
  
  return (
    <div className="flex items-center gap-2">

      {/* Search */}

      <button
        onClick={() => router.push("/search")}
        className="
          flex
          h-11
          w-11
          items-center
          justify-center

          rounded-xl

          transition-all

          hover:bg-slate-100
        "
      >
        <Search size={20} />
      </button>

      {/* Language */}

      <button
        className="
          hidden
          h-11
          w-11
          items-center
          justify-center

          rounded-xl

          transition-all

          hover:bg-slate-100

          md:flex
        "
      >
        <Globe size={20} />
      </button>

      {/* Notification */}

      <button
        className="
          hidden
          h-11
          w-11
          items-center
          justify-center

          rounded-xl

          transition-all

          hover:bg-slate-100

          md:flex
        "
      >
        <Bell size={20} />
      </button>

      {/* Publish */}

      <Button
        className="
          hidden

          h-11

          lg:flex
        "
      >
        发布信息
      </Button>

      {/* Desktop Avatar */}
      <div className="hidden lg:block">
        <Avatar
          name="S"
          size="md"
        />
      </div>

      {/* Mobile */}
      <MobileMenu />
  </div>
  );
}