import Image from "next/image";

const PageNotFound = ({ msg }) => {
  return (
    <>
      <div className="container">
        <Image
          src="https://cuitter.netlify.app/notfound.gif?url=%2Fnotfound.gif&w=384&q=75"
          width={300}
          height={300}
        />
        <p className="msg">{msg}</p>
      </div>

      <style jsx>{`
        .container {
          height: 90vh;
          background-color: #fff;
          display: grid;
          place-items: center;
        }
        .msg {
          margin-top: -5em;
          font-family: "Inconsolata", sans-serif;
          font-weight: 700;
          font-size: 1.7em;
        }
      `}</style>
    </>
  );
};

export default PageNotFound;
