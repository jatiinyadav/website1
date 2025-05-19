export default function Footer() {
  return (
    <>
      <div className="flex py-4 px-12 justify-between footer">
        <div></div>
        <div className="text-[#121A2A] description">
          <h1>
            Build by <a href="https://jatinyadav.dev" style={{textDecoration: "underline"}}>Jatin.</a>{" "}
          </h1>
        </div>
      </div>

      <style jsx>
        {`
          .footer {
            width: 100%;
            position: absolute;
            bottom: 0;
            text-align: right;
          }
        `}
      </style>
    </>
  );
}
