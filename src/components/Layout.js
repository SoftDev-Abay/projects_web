import React from "react";
import Topbar from "./Topbar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import BottomBar from "./BottomBar";

const Layout = ({ children, chat = false }) => {
  return (
    <main className="main">
      <LeftSidebar />
      <section className="main-container">
        {!chat && <Topbar />}
        <div
          className="main-container-content"
          style={
            chat
              ? { marginTop: "0px", padding: "0px", marginBottom: "0px" }
              : {}
          }
        >
          {children}
        </div>
        <BottomBar />
      </section>
      <RightSidebar />
    </main>
  );
};

export default Layout;
