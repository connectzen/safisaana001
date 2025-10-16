export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary via-purple-600 to-accent text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">DAIGAVILLA Ltd</h3>
            <p className="text-white/80 leading-relaxed">
              Your trusted partner in construction and real estate. Building dreams with excellence.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-white/80 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-white/80 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="text-white/80 hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#projects" className="text-white/80 hover:text-white transition-colors">
                  Projects
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-white/80">
              <li>Nairobi, Kenya</li>
              <li>Phone: 0721419509</li>
              <li>Email: daigavillalimited@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8 text-center text-white/80">
          <p>&copy; {new Date().getFullYear()} DAIGAVILLA Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
