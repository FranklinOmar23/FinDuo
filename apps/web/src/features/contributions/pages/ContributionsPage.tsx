import { AddContributionForm } from "../components/AddContributionForm";
import { ContributionsList } from "../components/ContributionsList";
import { useContributions } from "../hooks/useContributions";

export const ContributionsPage = () => {
  const { contributionsQuery } = useContributions();

  return (
    <section className="space-y-4">
      <AddContributionForm />
      <ContributionsList items={contributionsQuery.data ?? []} />
    </section>
  );
};
