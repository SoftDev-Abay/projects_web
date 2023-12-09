import React, { useState } from "react";
import "./App.scss";
import Topbar from "./components/Topbar";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddProject from "./pages/AddProject";
import Tasks from "./pages/Tasks";
import BottomBar from "./components/BottomBar";
import ProjectModal from "./modals/ProjectModal";
import TaskModal from "./modals/TaskModal";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import ChatPage from "./pages/ChatPage";
import AuthContext from "./context/AuthContext";
import Profile from "./pages/Profile";

function App() {
  const [isOpenProjectModal, setIsOpenProjectModal] = useState(false);
  const ProjectModalHandlier = (value) => {
    setIsOpenProjectModal(value);
  };

  return (
    <>
      <AuthContext>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <Layout>
                  <Dashboard modalHandlier={ProjectModalHandlier} />
                </Layout>
              }
            />
            <Route
              path="/add-project"
              element={
                <Layout>
                  <AddProject />
                </Layout>
              }
            />
            <Route
              path="/tasks"
              element={
                <Layout>
                  <Tasks />
                </Layout>
              }
            />
            <Route
              path="/chat"
              element={
                <Layout chat={true}>
                  <ChatPage />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
          </Routes>
        </Router>
        <ProjectModal
          isOpen={isOpenProjectModal}
          modalHandlier={ProjectModalHandlier}
        />
      </AuthContext>
    </>
  );
}

export default App;
