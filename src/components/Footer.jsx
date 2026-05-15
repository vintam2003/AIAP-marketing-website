const PLATFORM_LINK = "https://aiap.up.railway.app/";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
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
      </div>
    </footer>
  );
}

export default Footer;