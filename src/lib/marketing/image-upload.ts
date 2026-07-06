/** Image upload abstraction — storage wiring comes later. */
export type MarketingImageUploadResult = {
  url: string;
};

export async function uploadMarketingImage(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _file: File
): Promise<MarketingImageUploadResult> {
  throw new Error(
    "Image upload is not configured yet. Use an image URL field for now."
  );
}

export function isImageUploadConfigured(): boolean {
  return false;
}
