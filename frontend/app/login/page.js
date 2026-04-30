import AuthForm from '@/components/auth/AuthForm';
import PageHero from '@/components/layout/PageHero';

export default function LoginPage() {
  return (
    <>
      <PageHero
        eyebrow="Login"
        title="Return to your NorthStitch account"
        text="Sign in with your email and password while keeping the same simple storefront experience."
      />
      <AuthForm mode="login" />
    </>
  );
}
