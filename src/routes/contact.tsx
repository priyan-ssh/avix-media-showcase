import { createFileRoute } from "@tanstack/react-router";
import contact from "@/content/contact.json";
import { ContactSplit } from "@/components/ContactSplit";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Aviix Media" },
      {
        name: "description",
        content:
          "Let's create something amazing. Get in touch with Aviix Media for video editing and content collaboration.",
      },
      { property: "og:title", content: "Contact — Aviix Media" },
      {
        property: "og:description",
        content:
          "Send Aviix Media a message about your next video project. India • Worldwide.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return <ContactSplit data={contact} />;
}
