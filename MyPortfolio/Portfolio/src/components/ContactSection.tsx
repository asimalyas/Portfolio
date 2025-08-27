import React, { useState } from "react";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin } from "lucide-react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit with EmailJS
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs
      .send(
        "service_xxxxxxx", // 🔑 replace with your EmailJS service ID
        "template_jw7yt8n", // 🔑 your template ID
        formData,
        "user_xxxxxxx" // 🔑 your public key
      )
      .then(() => {
        toast.success("✅ Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        setIsSubmitting(false);
      })
      .catch(() => {
        toast.error("❌ Failed to send. Try again later.");
        setIsSubmitting(false);
      });
  };

  return (
    <section id="contact" className="py-20 px-4 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-3xl"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Let’s Build Something Together 🚀
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 bg-gray-900/50 p-8 rounded-2xl border border-gray-700 shadow-xl backdrop-blur-sm"
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            ></textarea>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message ✉️"}
            </button>
          </motion.form>

          {/* Contact Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900/50 p-10 rounded-2xl border border-gray-700 shadow-xl flex flex-col items-center text-center space-y-6 backdrop-blur-sm"
          >
            <h3 className="text-2xl font-bold mb-4">Connect with Me</h3>

            {/* Social Links */}
            <div className="flex space-x-6">
              <a
                href="https://github.com/asimalyas"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-gray-600 rounded-full hover:bg-gray-800 transition-transform hover:scale-110"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-gray-600 rounded-full hover:bg-gray-800 transition-transform hover:scale-110"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-gray-600 rounded-full hover:bg-gray-800 transition-transform hover:scale-110"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>

            {/* Info */}
            <div className="space-y-3">
              <p className="text-gray-400">📞 Phone / WhatsApp:</p>
              <a
                href="tel:+923201587154"
                className="text-white hover:underline"
              >
                +92 320 1587154
              </a>
              <span className="block text-gray-400">/ +92 355 6074440</span>

              <p className="text-gray-400 mt-4">📧 Email:</p>
              <a
                href="mailto:asimalyas44440@gmail.com"
                className="text-white hover:underline"
              >
                asimalyas44440@gmail.com
              </a>

              <p className="text-gray-400 mt-4">📍 Location:</p>
              <span className="text-white">Abbottabad, Pakistan</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
