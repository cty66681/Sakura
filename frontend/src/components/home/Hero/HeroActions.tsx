import Button from "@/components/ui/Button";
import { ArrowRight, Plus } from "lucide-react";

export default function HeroActions() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">

      {/* Primary */}

      <Button
        className="
          h-14
          px-8
          text-base
          shadow-lg
        "
      >
        开始探索

        <ArrowRight
          size={18}
          className="ml-2"
        />

      </Button>

      {/* Secondary */}

      <Button
        variant="outline"
        className="
          h-14
          px-8
          text-base
        "
      >
        <Plus
          size={18}
          className="mr-2"
        />

        发布信息

      </Button>

    </div>
  );
}