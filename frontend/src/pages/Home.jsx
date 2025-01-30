import Dropzone from "../components/Dropzone";
import Header from "../components/Header";
import PaymentTable from "../components/PaymentTable";
import { PaymentsContextProvider } from "../contexts/PaymentsContext";
import LoadPaymentsMenu from "../components/LoadPaymentsMenu";
import "../styles/Home.css";

function Home() {
  return (
    <>
      <Header />
      <PaymentsContextProvider>
        <div className="home-management">
          <Dropzone />
          <LoadPaymentsMenu />
        </div>
        <PaymentTable />
      </PaymentsContextProvider>
    </>
  );
}

export default Home;
