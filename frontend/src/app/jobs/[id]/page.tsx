import { notFound } from "next/navigation";

import Container from "@/components/layout/Container";

import JobHeader from "@/components/job/JobHeader";
import JobInfo from "@/components/job/JobInfo";
import JobBenefit from "@/components/job/JobBenefit";
import JobDescription from "@/components/job/JobDescription";
import JobContact from "@/components/job/JobContact";

import { jobs } from "@/data/jobs";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const job = jobs.find(
    (item) => item.id === Number(id)
  );

  if (!job) {
    notFound();
  }

  return (
    <main className="py-10">
      <Container>

        <div className="space-y-8">

          <JobHeader
            company={job.company}
            companyLogo={job.companyLogo}
            title={job.title}
            salary={job.salary}
            location={job.location}
            verified={job.verified}
          />

          <JobInfo
            employmentType={job.employmentType}
            remote={job.remote}
            experience={job.experience}
            education={job.education}
            language={job.language}
            workingHours={job.workingHours}
            holiday={job.holiday}
          />

          <JobBenefit
            benefits={job.benefits}
          />

          <JobDescription
            description={job.description}
          />

          <JobContact
            contactName={job.contactName}
            phone={job.phone}
            email={job.email}
          />

        </div>

      </Container>
    </main>
  );
}