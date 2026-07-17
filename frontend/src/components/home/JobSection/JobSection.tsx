import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import JobCard from "../JobCard";
import { jobs } from "@/data/jobs";

export default function JobSection() {
  return (
    <section className="py-24">
      <Container>

        <SectionHeader
          title="最新工作"
          description="精选适合在日华人的热门岗位"
          href="/jobs"
        />

        <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
          {jobs.map((job) => (
            <JobCard
              key={`${job.company}-${job.title}`}
              {...job}
            />
          ))}
        </div>

      </Container>
    </section>
  );
}