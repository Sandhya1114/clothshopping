import AuthForm from '@/components/auth/AuthForm';
import PageHero from '@/components/layout/PageHero';

export default function SignupPage() {
  return (
    <>
      <PageHero
        eyebrow="Sign Up"
        title="Create an account in a few seconds"
        text="Add optional login and signup to the storefront without removing guest checkout."
      />
      <AuthForm mode="signup" />
    </>
  );
}
