"use client";

import { MarketingCrudPage } from "@/components/admin/marketing/marketing-crud-page";
import { createGalleryItem, updateGalleryItem } from "@/lib/marketing/actions";
import { gallerySchema } from "@/lib/marketing/schemas";
import {
  GalleryFormFields,
  galleryFormDefaults,
} from "@/components/admin/marketing/forms/gallery-form";

export default function MarketingGalleryPage() {
  return (
    <MarketingCrudPage
      title="Customer Gallery"
      description="Customer photos and captions for the gallery masonry grid."
      table="marketing_gallery_items"
      schema={gallerySchema}
      defaultValues={galleryFormDefaults}
      onCreate={createGalleryItem}
      onUpdate={updateGalleryItem}
      columns={[
        { key: "customer_name", label: "Customer" },
        { key: "instagram_handle", label: "Handle", className: "hidden md:table-cell" },
      ]}
      renderFields={(register) => <GalleryFormFields register={register} />}
    />
  );
}
