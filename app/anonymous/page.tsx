import AnonyomousAuth from "@/components/farmui/auth";
import PageWrapper from "@/components/wrapper/page-wrapper";

export default async function Anonyomous() {
  return (
    <PageWrapper>
      <AnonyomousAuth type="login" />
    </PageWrapper>
  );
}
