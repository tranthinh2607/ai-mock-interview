import { useState } from "react";
import { Mail, MapPin, Phone, Copy, Bot } from "lucide-react";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [statusMessage, setStatusMessage] = useState<string>(""); // thông báo cho form
  const [copyMessage, setCopyMessage] = useState<{ type?: "email" | "phone"; message: string }>({
    type: undefined,
    message: "",
  }); // thông báo cho copy

  const handleCopy = (text: string, type: "email" | "phone") => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "email") {
        setCopyMessage({ type: "email", message: "Email copied successfully!" });
      } else {
        setCopyMessage({ type: "phone", message: "Phone number copied successfully!" });
      }
      setTimeout(() => setCopyMessage({ type: undefined, message: "" }), 2000); // ẩn sau 2s
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" }); // clear lỗi khi gõ
    setStatusMessage(""); // clear thông báo cũ
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let newErrors: { name?: string; email?: string; message?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setStatusMessage("Your information has been sent successfully!");
      setFormData({ name: "", email: "", message: "" }); // reset form

      // Ẩn status sau 3 giây
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  return (
    <div className="flex-col w-full pb-24">
      <Container>
        {/* Header Section */}
        <div className="my-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            We&apos;d love to hear from you! Whether you have a question about
            features, trials, pricing, or anything else, our team is ready to
            answer all your questions.
          </p>

          {/* AI Support Button */}
          <div className="flex justify-center mt-6">
            <Button
              asChild
              className="flex items-center gap-2 bg-primary text-white px-8 py-4 text-lg rounded-xl shadow-lg"
            >
              <a
                href="https://www.messenger.com/t/754307874422696"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Bot className="w-6 h-6" /> AI SUPPORT
              </a>
            </Button>
          </div>
        </div>

        {/* Main Content: Form and Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-2"
                  rows={5}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>

            {/* Status message */}
            {statusMessage && (
              <p className="text-green-600 text-center mt-4">{statusMessage}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8 flex flex-col justify-center">
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">Email</h3>
                  {copyMessage.type === "email" && (
                    <span className="text-green-600 text-sm">
                      {copyMessage.message}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">
                  Our support team is here to help.
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href="mailto:anhemsuppot@gmail.com"
                    className="text-primary hover:underline"
                  >
                    anhemsuppot@gmail.com
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleCopy("anhemsuppot@gmail.com", "email")
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">Phone</h3>
                  {copyMessage.type === "phone" && (
                    <span className="text-green-600 text-sm">
                      {copyMessage.message}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">Mon-Fri from 9am to 5pm.</p>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:+84395243133"
                    className="text-primary hover:underline"
                  >
                    +84 395243133
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy("0395243133", "phone")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Office */}
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">Office</h3>
                <p className="text-muted-foreground">
                  606/17 - Đường Hồ Học Lãm - Phường An Lạc - TP.HCM
                </p>
                <a
                  href="https://www.google.com/maps/place/606+H%E1%BB%93+H%E1%BB%8Dc+L%C3%A3m,+B%C3%ACnh+Tr%E1%BB%8B+%C4%90%C3%B4ng+B,+B%C3%ACnh+T%C3%A2n,+H%E1%BB%93+Ch%C3%AD+Minh,+Vi%E1%BB%87t+Nam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline mt-2"
                >
                  <MapPin className="w-4 h-4 mr-1" /> View on Map
                </a>
              </div>
            </div>

            {/* Donate Section */}
            <div className="text-center space-y-4">
              <img
                src="/assets/img/donate.jpg"
                alt="Donate QR"
                className="mx-auto rounded-lg shadow-md w-64 h-auto"
              />
              <p className="text-muted-foreground font-medium">
                Mọi người hãy ủng hộ dự án ❤️
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ContactPage;
