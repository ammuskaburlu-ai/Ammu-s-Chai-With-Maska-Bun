"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MarketingCrudPage } from "@/components/admin/marketing/marketing-crud-page";
import { createVideoTestimonial, updateVideoTestimonial } from "@/lib/marketing/actions";
import { videoTestimonialSchema } from "@/lib/marketing/schemas";

const defaults = {
  customer_name: "",
  quote: "",
  thumbnail_url: "",
  video_url: "",
  sort_order: 0,
  is_active: true,
};

export default function MarketingVideosPage() {
  return (
    <MarketingCrudPage
      title="Video Testimonials"
      description="Store video URLs only — no uploads. Thumbnails optional."
      table="marketing_video_testimonials"
      schema={videoTestimonialSchema}
      defaultValues={defaults}
      onCreate={createVideoTestimonial}
      onUpdate={updateVideoTestimonial}
      columns={[{ key: "customer_name", label: "Customer" }]}
      renderFields={(register) => (
        <>
          <div>
            <Label>Customer Name</Label>
            <Input {...register("customer_name")} />
          </div>
          <div>
            <Label>Quote</Label>
            <Textarea rows={2} {...register("quote")} />
          </div>
          <div>
            <Label>Thumbnail URL</Label>
            <Input {...register("thumbnail_url")} />
          </div>
          <div>
            <Label>Video URL</Label>
            <Input {...register("video_url")} />
          </div>
          <div>
            <Label>Sort Order</Label>
            <Input type="number" {...register("sort_order")} />
          </div>
        </>
      )}
    />
  );
}
