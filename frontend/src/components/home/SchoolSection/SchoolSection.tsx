import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

import SchoolCard from "../SchoolCard";

import { schools } from "@/data/schools";

export default function SchoolSection() {
  return (
    <section className="py-24">

      <Container>

        <SectionHeader
          title="日本升学"
          description="大学、大学院、专门学校最新招生信息。"
          href="/schools"
          actionText="查看全部"
        />

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {schools.map((school) => (
            <SchoolCard
              key={school.id}
              {...school}
            />
          ))}

        </div>

        <div className="mt-12 flex justify-center">

          <Button variant="outline">
            查看更多学校
          </Button>

        </div>

      </Container>

    </section>
  );
}