import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-background/70 py-8 mt-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-center md:text-left text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} TechPerspectives. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy">
              <a className="text-muted-foreground hover:text-secondary transition duration-300">
                Privacy Policy
              </a>
            </Link>
            <Link href="/terms">
              <a className="text-muted-foreground hover:text-secondary transition duration-300">
                Terms of Use
              </a>
            </Link>
            <Link href="/rss">
              <a className="text-muted-foreground hover:text-secondary transition duration-300">
                RSS Feed
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
