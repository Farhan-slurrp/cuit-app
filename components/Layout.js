import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useGlobalContext } from "../custom-hooks/context";

const Layout = ({ children }) => {
  const { tokenInfo, onLogout } = useGlobalContext();
  const router = useRouter();

  return (
    <>
      <div className="container">
        <nav>
          <div className="logo">
            <Link href="/">
              <a>Cuit.</a>
            </Link>
          </div>
          <div className="link">
            {!tokenInfo ? (
              <>
                <Link href="/login">
                  <button
                    className={`linkbtn ${
                      router.pathname == "/login" ? "link-active" : ""
                    }`}
                  >
                    Login
                  </button>
                </Link>
                <span className="slash">/</span>
                <Link href="/signup">
                  <button
                    className={`linkbtn ${
                      router.pathname == "/signup" ? "link-active" : ""
                    }`}
                  >
                    SignUp
                  </button>
                </Link>
              </>
            ) : (
              <button className="linkbtn" onClick={() => onLogout()}>
                Logout
              </button>
            )}
          </div>
        </nav>
        <div className="main">
          <div className="sidebar">
            <ul className="sidebarlink">
              <Link href="/">
                <li
                  className={
                    router.pathname == "/" || router.pathname == "/threads/[id]"
                      ? "active"
                      : ""
                  }
                >
                  All Cuits
                </li>
              </Link>
              {tokenInfo && (
                <Link href={`/users/${tokenInfo.user.userId}`}>
                  <li
                    className={router.pathname == "/users/[id]" ? "active" : ""}
                  >
                    My Cuits
                  </li>
                </Link>
              )}
            </ul>
          </div>
          {children}
        </div>
      </div>

      <style jsx>{`
        .container {
          height: 100vh;
          display: grid;
          grid-template-rows: 10% auto;
        }
        .main {
          position: relative;
          display: grid;
          grid-template-columns: 20vw auto;
        }
        .sidebar {
          height: 90vh;
          background: #222;
          z-index: 100;
          display: flex;
          padding: 2em 1em;
        }
        nav {
          height: 100%;
          width: 100%;
          box-shadow: 0 4px 2px -2px gray;
          display: flex;
          padding: 0 5em;
          justify-content: space-between;
          align-items: center;
          z-index: 100;
        }
        .logo {
          height: 100%;
          display: flex;
          align-items: center;
          font-family: "lobster", sans-serif;
          color: #333;
          font-weight: 800;
          font-size: 3.2em;
        }
        .logo > a {
          transform: rotate(-5deg);
        }
        .link {
          height: 100%;
          display: flex;
          gap: 0.6em;
          align-items: center;
        }
        .slash {
          margin-top: -0.3em;
          font-size: 2.6em;
          font-weight: 400;
        }
        .linkbtn {
          background: transparent;
          border: 2px solid #333;
          border-radius: 0.5em;
          padding: 0.5em 1.1em;
          font-family: "Ubuntu", sans-serif;
          font-size: 1em;
          font-weight: 500;
          cursor: pointer;
        }
        .linkbtn:hover {
          background: #333;
          color: white;
        }
        .link-active {
          background: #333;
          color: white;
        }
        .sidebarlink {
          height: 100%;
          width: 100%;
          list-style: none;
          color: white;
          margin: 0;
          padding: 1em 0;
          font-family: "Ubuntu", sans-serif;
          display: flex;
          gap: 1em;
          flex-direction: column;
          align-items: center;
        }
        .sidebarlink > li {
          padding: 0.5em 5.5vw;
          font-size: 1.15em;
          cursor: pointer;
        }
        .sidebarlink > li:hover {
          background: white;
          color: black;
        }
        .active {
          border: 1px solid white;
        }
      `}</style>
    </>
  );
};

export default Layout;
