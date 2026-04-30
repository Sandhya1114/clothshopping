import PageHero from '@/components/layout/PageHero';

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let customers reach your team clearly"
        text="This starter includes a polished contact page layout you can later connect to email or CRM workflows."
      />
      <section className="container contact-grid section-spacing">
        <article className="info-card">
          <h2>Studio</h2>
          <p>214 Market Street</p>
          <p>New York, NY 10012</p>
          <p>support@northstitch.com</p>
          <p>+1 (555) 240-1122</p>
        </article>

        <form className="contact-form info-card">
          <h2>Send a message</h2>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" placeholder="Your name" />
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="name@example.com" />
          <label htmlFor="message">Message</label>
          <textarea id="message" rows="5" placeholder="Tell us how we can help" />
          <button type="button" className="button button-primary">
            Form UI Ready
          </button>
        </form>
      </section>
    </>
  );
}
