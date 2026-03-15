import { Github, Linkedin, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 pt-16 pb-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand Section */}
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-xl font-bold mb-4">BiblioManzil</h3>

          <p className="text-neutral-500 max-w-sm leading-relaxed">
            Your ultimate destination for motivational content, book summaries,
            and free e-books. Empowering readers to reach their full potential,
            one page at a time.
          </p>

          <p className="text-neutral-400 text-sm mt-3">
            Follow our journey and daily motivation on Instagram @bibliomanzil
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">

            <a
              href="https://www.instagram.com/bibliomanzil/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white border rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>

            <a
              href="https://www.linkedin.com/in/ansh-bansal-006873246"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white border rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            <a
              href="https://github.com/AnshBansalbpl"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white border rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>

          </div>
        </div>

        {/* Platform Links */}
        <div>
          <h4 className="font-semibold mb-4">Platform</h4>

          <ul className="space-y-2 text-neutral-500 text-sm">

            <li>
              <a href="/" className="hover:text-black">
                Home
              </a>
            </li>

            <li>
              <a href="/blogs" className="hover:text-black">
                Blogs
              </a>
            </li>

            <li>
              <a href="/summaries" className="hover:text-black">
                Book Summaries
              </a>
            </li>

            <li>
              <a href="/ebooks" className="hover:text-black">
                Free E-Books
              </a>
            </li>

            <li>
              <a href="/reels" className="hover:text-black">
                Motivational Reels
              </a>
            </li>

          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h4 className="font-semibold mb-4">Support</h4>

          <ul className="space-y-2 text-neutral-500 text-sm">

            <li>
              <a
                href="mailto:bibliomanzil@gmail.com"
                className="hover:text-black"
              >
                Contact Us
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-black">
                Privacy Policy
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-black">
                Terms of Service
              </a>
            </li>

            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>bibliomanzil@gmail.com</span>
            </li>

          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-neutral-200 text-center text-neutral-400 text-xs">
        © {new Date().getFullYear()} BiblioManzil. All rights reserved.
      </div>
    </footer>
  );
}
