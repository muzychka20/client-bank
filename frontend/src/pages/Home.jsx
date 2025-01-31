import Dropzone from "../components/Dropzone";
import Header from "../components/Header";
import PaymentTable from "../components/PaymentTable";
import { PaymentsContextProvider } from "../contexts/PaymentsContext";
import LoadPaymentsMenu from "../components/LoadPaymentsMenu";
import "../styles/Home.css";
import { useState } from "react";

function Home() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Header />
      <PaymentsContextProvider>
        <div className="home-management">
          <Dropzone />
          <LoadPaymentsMenu loading={loading} setLoading={setLoading} />
        </div>
        <PaymentTable loading={loading} setLoading={setLoading} />
      </PaymentsContextProvider>
    </>
  );
}

export default Home;
