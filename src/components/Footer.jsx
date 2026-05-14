const PLATFORM_LINK = "https://your-aiap-link.com";

function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>AIAP</strong>
        <p>ATM Intelligence and Availability Platform</p>
      </div>

      <a
        href={PLATFORM_LINK}
        target="_blank"
        rel="noreferrer"
        className="primary-btn"
      >
        Launch AIAP Platform
      </a>
    </footer>
  );
}

export default Footer;