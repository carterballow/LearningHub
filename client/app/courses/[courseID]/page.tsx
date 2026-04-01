import { CoursePageLayout } from "@/components/course-page-layout"
import { CoursePageContent } from "@/components/course-page-content"

export default async function CoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ courseID: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { courseID } = await params
  const sp = await searchParams
  const tab = sp.tab ?? "overview"

  return (
    <CoursePageLayout courseId={courseID}>
      <CoursePageContent courseId={courseID} activeTab={tab} />
    </CoursePageLayout>
  )
}
