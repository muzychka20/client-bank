import Dropzone from "../components/Dropzone";
import Header from "../components/Header";
import PaymentTable from "../components/PaymentTable";
import LoadPaymentsMenu from "../components/LoadPaymentsMenu";
import "../styles/Home.css";
import { useState } from "react";
import AnalyzeButtons from "../components/AnalyzeButtons";

function Home() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Header />
      <div className="home-management">
        <Dropzone />
        <div className="home-management-buttons">
          <LoadPaymentsMenu loading={loading} setLoading={setLoading} />
          <AnalyzeButtons />
        </div>
      </div>
      <PaymentTable loading={loading} setLoading={setLoading} />
    </>
  );
}

export default Home;
