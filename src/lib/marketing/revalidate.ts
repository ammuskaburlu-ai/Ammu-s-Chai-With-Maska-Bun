import { revalidatePath } from "next/cache";

export function revalidateMarketingPaths() {
  revalidatePath("/");
  revalidatePath("/community");
  revalidatePath("/menu");
  revalidatePath("/admin/marketing", "layout");
}
