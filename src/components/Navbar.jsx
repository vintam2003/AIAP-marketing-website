const PLATFORM_LINK = "https://your-aiap-link.com";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-mark">AI</div>
        <span>AIAP</span>
      </div>

      <div className="nav-links">
        <a href="#problem">Problem</a>
        <a href="#demo">Demo</a>
        <a href="#features">Features</a>
        <a href="#models">Models</a>

        <a
          href={PLATFORM_LINK}
          target="_blank"
          rel="noreferrer"
          className="nav-btn"
        >
          Launch Platform
        </a>
      </div>
    </nav>
  );
}

export default Navbar;