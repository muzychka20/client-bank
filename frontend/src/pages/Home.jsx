import Dropzone from "../components/Dropzone";
import Header from "../components/Header";
import PaymentTable from "../components/PaymentTable";
import { PaymentsContextProvider } from "../contexts/PaymentsContext";

function Home() {
  return (
    <>
      <Header />
      <PaymentsContextProvider>
        <Dropzone />
        <PaymentTable />
      </PaymentsContextProvider>
    </>
  );
}

export default Home;
