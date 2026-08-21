import Container from "@/components/layout/Container";

import LanguageSchoolHeader from "@/components/schools/language/LanguageSchoolHeader";
import LanguageSchoolInfo from "@/components/schools/language/LanguageSchoolInfo";
import LanguageSchoolCourse from "@/components/schools/language/LanguageSchoolCourse";
import LanguageSchoolTuition from "@/components/schools/language/LanguageSchoolTuition";
import LanguageSchoolDormitory from "@/components/schools/language/LanguageSchoolDormitory";
import LanguageSchoolGallery from "@/components/schools/language/LanguageSchoolGallery";
import LanguageSchoolReview from "@/components/schools/language/LanguageSchoolReview";
import LanguageSchoolSidebar from "@/components/schools/language/LanguageSchoolSidebar";

export default async function LanguageSchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="bg-slate-50 pb-20">

      {/* Header */}

      <LanguageSchoolHeader id={id} />

      <Container>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* Left */}

          <div className="space-y-8">

            <LanguageSchoolInfo id={id} />

            <LanguageSchoolCourse id={id} />

            <LanguageSchoolTuition id={id} />

            <LanguageSchoolDormitory id={id} />

            <LanguageSchoolGallery id={id} />

            <LanguageSchoolReview id={id} />

          </div>

          {/* Right */}

          <LanguageSchoolSidebar id={id} />

        </div>

      </Container>

    </main>
  );
}