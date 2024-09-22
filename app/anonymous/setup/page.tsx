import AnonyomousAuth from "@/components/farmui/auth";
import PageWrapper from "@/components/wrapper/page-wrapper";

export default async function AnonyomousSetup() {
  return (
    <PageWrapper>
      <AnonyomousAuth type="setup" />
    </PageWrapper>
  );
}
