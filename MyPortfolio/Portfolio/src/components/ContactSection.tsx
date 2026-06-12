import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import { portfolioData } from "../../shared/portfolio.js";

const SERVICE_ID = "service_kvvu6el";
const TEMPLATE_ID = "template_jw7yt8n";
const PUBLIC_KEY = "lobdwVIuh3vY9JfNr";

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize EmailJS on mount
  useEffect(() => {
    emailjs.init(PUBLIC_KEY);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (formData.message.trim().length < 10) {
      toast.error("Message must be at least 10 characters long.");
      return;
    }

    setIsSubmitting(true);

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, {
        from_name: formData.name,
        from_email: formData.email.toLowerCase(),
        message: formData.message,
      })
      .then(() => {
        toast.success("Message sent successfully! I'll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        // Fallback to mailto
        const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
        const body = encodeURIComponent(`${formData.message}\n\nFrom: ${formData.email}`);
        const mailtoLink = `mailto:${encodeURIComponent(portfolioData.contact.email)}?subject=${subject}&body=${body}`;
        toast.error(
          "Email service is temporarily unavailable. Click below to send via your email app.",
          {
            action: {
              label: "Open Email App",
              onClick: () => window.open(mailtoLink, "_blank"),
            },
            duration: 10000,
          }
        );
        setIsSubmitting(false);
      });
  };

  const socialLinks = [
    {
      icon: <Github className="w-5 h-5" />,
      href: portfolioData.links.github,
      label: "GitHub",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: portfolioData.links.linkedin,
      label: "LinkedIn",
    },
  ];

  return (
    <section id="contact" className="py-24 px-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-500/10 dark:bg-purple-500/15 blur-[120px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Let's Connect
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Have a project in mind or just want to say hi? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5 bg-card p-8 rounded-2xl border border-border shadow-lg"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell me about your project or idea..."
                rows={5}
                maxLength={500}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none resize-none transition-all"
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {formData.message.length}/500
              </p>
            </div>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-semibold text-base bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Contact Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card p-8 rounded-2xl border border-border shadow-lg flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6 text-foreground">Get in Touch</h3>

              {/* Contact Details */}
              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-0.5">Phone / WhatsApp</p>
                    <a href={`tel:${portfolioData.contact.phones[0].replace(/\s/g, "")}`} className="text-foreground hover:text-indigo-500 transition-colors font-medium">
                      {portfolioData.contact.phones[0]}
                    </a>
                    <span className="block text-sm text-muted-foreground">{portfolioData.contact.phones[1]}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-0.5">Email</p>
                    <a href={`mailto:${portfolioData.contact.email}`} className="text-foreground hover:text-purple-500 transition-colors font-medium">
                      {portfolioData.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-0.5">Location</p>
                    <span className="text-foreground font-medium">{portfolioData.contact.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">Follow me</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-xl border border-border bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
