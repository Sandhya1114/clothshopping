import AccountClient from '@/components/auth/AccountClient';
import PageHero from '@/components/layout/PageHero';

export default function AccountPage() {
  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Your profile and storefront session"
        text="Manage your sign-in state and continue into checkout with a simpler returning-user flow."
      />
      <AccountClient />
    </>
  );
}
