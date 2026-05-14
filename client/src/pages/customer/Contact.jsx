import { Mail, MapPin, Phone } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

function Contact() {
  const { settings } = useSettings();

  return (
    <section className="bg-[#FFF7D6] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
          Contact
        </p>

        <h1 className="text-5xl font-black text-slate-900">
          Get in touch.
        </h1>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-black text-slate-900">
              Contact Information
            </h2>

            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-green-100 p-3 text-green-700">
                  <Phone />
                </div>

                <div>
                  <p className="text-sm font-black text-slate-900">
                    Phone
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    {settings.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-yellow-100 p-3 text-yellow-700">
                  <Mail />
                </div>

                <div>
                  <p className="text-sm font-black text-slate-900">
                    Email
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    {settings.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-pink-100 p-3 text-pink-700">
                  <MapPin />
                </div>

                <div>
                  <p className="text-sm font-black text-slate-900">
                    Address
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    {settings.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form className="rounded-[32px] bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-black text-slate-900">
              Send Message
            </h2>

            <div className="mt-6 grid gap-4">
              <input
                type="text"
                placeholder="Your name"
                className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400"
              />

              <input
                type="email"
                placeholder="Your email"
                className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400"
              />

              <textarea
                rows="5"
                placeholder="Your message"
                className="resize-none rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400"
              />

              <button
                type="button"
                className="rounded-[60px] bg-green-500 px-6 py-4 text-sm font-black text-white shadow-lg"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;