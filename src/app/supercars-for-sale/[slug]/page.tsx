import { redirect } from 'next/navigation';

interface SupercarPageParams {
  slug: string
}

export default function SupercarPage(
  { params }: { params: Promise<SupercarPageParams> }
) {
  // We don't actually need the slug, but we await params to satisfy Next 15 types
  void params;
  // Redirect all supercar URLs to the not-available page
  redirect('/supercars-for-sale/not-available');
}