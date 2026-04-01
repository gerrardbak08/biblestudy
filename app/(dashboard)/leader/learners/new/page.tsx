// app/(dashboard)/leader/learners/new/page.tsx
// Server Component shell — renders the client LearnerForm inside a card

import { Header } from "@/components/layout/Header";
import { LearnerForm } from "@/components/forms/LearnerForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewLearnerPage() {
  return (
    <>
      <Header title="교육생 등록" />
      <div className="p-6 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>새 교육생 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <LearnerForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
