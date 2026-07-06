"use client";

import { MarketingCrudPage } from "@/components/admin/marketing/marketing-crud-page";
import { createGoogleReview, updateGoogleReview } from "@/lib/marketing/actions";
import { reviewSchema } from "@/lib/marketing/schemas";
import { ReviewFormFields, reviewFormDefaults } from "@/components/admin/marketing/forms/review-form";

export default function MarketingReviewsPage() {
  return (
    <MarketingCrudPage
      title="Google Reviews"
      description="Curated Google-style review cards on the homepage."
      table="marketing_google_reviews"
      schema={reviewSchema}
      defaultValues={reviewFormDefaults}
      onCreate={createGoogleReview}
      onUpdate={updateGoogleReview}
      columns={[
        { key: "reviewer", label: "Reviewer" },
        {
          key: "rating",
          label: "Rating",
          className: "hidden sm:table-cell",
          render: (row) => `${row.rating}★`,
        },
      ]}
      renderFields={(register) => <ReviewFormFields register={register} />}
    />
  );
}
