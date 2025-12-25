import Link from "next/link";

function PublicFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  H
                </span>
              </div>
              <span className="text-xl font-bold text-foreground sm:inline">
                Health Care
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your health is our priority. We are here to provide the best
              medical services.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/consultation"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Doctors
                </Link>
              </li>
              <li>
                <Link
                  href="/medicine"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Medicine
                </Link>
              </li>
              <li>
                <Link
                  href="/ngos"
                  className="text-muted-foreground hover:text-foreground"
                >
                  NGOs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/frequently-asked-questions"
                  className="text-muted-foreground hover:text-foreground"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/policy"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Contact Us</h3>
            <p className="text-sm text-muted-foreground">
              123 Medical Lane
              <br />
              Health City, HC 12345
              <br />
              contact@healthcare.com
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Health Care. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
export default PublicFooter;
