import { redirect } from 'next/navigation';

export default function SupercarPage({ params }: { params: { slug: string } }) {
  // Redirect all supercar URLs to the not-available page
  redirect('/supercars-for-sale/not-available');
} 