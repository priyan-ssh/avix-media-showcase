import { createFileRoute } from "@tanstack/react-router";
import { ContactSplit } from "@/components/ContactSplit";
import { useContent } from "@/hooks/useContent";

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
        content: "Send Aviix Media a message about your next video project. India • Worldwide.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const contact = useContent("contact");
  return <ContactSplit data={contact} />;
}
