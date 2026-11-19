import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      &copy; {new Date().getFullYear()} BULINGA Technical Secondary School. All rights reserved.
    </footer>
  );
}

export default Footer;
