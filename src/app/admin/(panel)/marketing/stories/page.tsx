"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarketingCrudPage } from "@/components/admin/marketing/marketing-crud-page";
import { createStory, updateStory } from "@/lib/marketing/actions";
import { storySchema } from "@/lib/marketing/schemas";

const defaults = {
  title: "",
  thumbnail_url: "",
  story_url: "",
  sort_order: 0,
  is_active: true,
};

export default function MarketingStoriesPage() {
  return (
    <MarketingCrudPage
      title="Stories"
      description="Instagram story highlights on the community page."
      table="marketing_stories"
      schema={storySchema}
      defaultValues={defaults}
      onCreate={createStory}
      onUpdate={updateStory}
      columns={[{ key: "title", label: "Title" }]}
      renderFields={(register) => (
        <>
          <div>
            <Label>Title</Label>
            <Input {...register("title")} />
          </div>
          <div>
            <Label>Thumbnail URL</Label>
            <Input {...register("thumbnail_url")} />
          </div>
          <div>
            <Label>Story URL</Label>
            <Input {...register("story_url")} />
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
