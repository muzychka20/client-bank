import { useEffect, useState } from "react";
import api from "../api";
import Dropzone from "../components/Dropzone";

function Home() {
  useEffect(() => {}, []);

  return (
    <div>
      <h1>Hello</h1>
      {/* <DragDropFile/> */}
      <Dropzone />
    </div>
  );
}

export default Home;
