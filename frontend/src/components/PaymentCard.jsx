
import LoadingIndicator from "./LoadingIndicator";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { usePayments } from "../contexts/PaymentsContext";
import api from "../api";
import "../styles/PaymentCard.css";

function PaymentCard() {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { source } = usePayments();
  const navigate = useNavigate();

  const [cities, setCities] = useState([]);
  const [streets, setStreets] = useState([]);
  const [houses, setHouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [clients, setClients] = useState([]);

  const statusStyle = {
    1: "status-process",
    3: "status-deleted",
    5: "status-success",
  };
    
    const fetchAdditionalData = async () => {
        try {
            const citiesResponse = await api.get("/api/cities/");
            // const streetsResponse = await api.get("/api/streets/");
            // const housesResponse = await api.get("/api/houses/");
            // const locationsResponse = await api.get("/api/locations/");
            
            // const clientsResponse = await api.get("/api/clients/");

            setCities(citiesResponse.data);
            // setStreets(streetsResponse.data);
            // setHouses(housesResponse.data);
            // setLocations(locationsResponse.data);
            // setClients(clientsResponse.data);
        } catch (err) {
            console.error("Ошибка при загрузке дополнительных данных", err);
        }
    };

  useEffect(() => {
    async function fetchPayment() {
      try {
        const response = await api.get(`/api/payments/${source}/${id}/`);
        console.log("Ответ API:", response.data);

        if (response.data) {
          setPayment(response.data);
          if (response.data.status.id === 1) {
            console.log("✅✅✅✅✅✅✅✅✅✅✅ Триггер");
            fetchAdditionalData();
          }
        } else {
          setError("Данные отсутствуют");
        }
      } catch (err) {
        setError("Ошибка загрузки данных");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchPayment();      
    }
  }, [id]);

  useEffect(() => {
    console.log("Обновленные данные:", payment);
  }, [payment]);

  if (loading) {
    return (
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg main-loading-container">
        {loading && <LoadingIndicator />}
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  if (!payment) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 payment-card">
      <Card className="w-full max-w-md" style={{ padding: "30px" }}>
        <h5 className="text-xl font-bold text-gray-900">Платеж №{payment.num_doc}</h5>
        <p
          className="text-gray-700 flex"
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <span className="mr-4">Дата: {new Date(payment.date).toLocaleDateString()}</span>
          {payment.dt_load && (
            <span>Загрузка: {new Date(payment.dt_load).toLocaleDateString()}</span>
          )}
        </p>
        <p
          className="text-gray-700 flex"
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <span className="text-gray-900 font-semibold">Сумма: {payment.sum} грн</span>
          {payment.name_bank && <span className="text-gray-700">Банк: {payment.name_bank}</span>}
        </p>
        <p className="font-medium text-gray-900 dark:text-white">
          Статус: <span className={`${statusStyle[payment.status.id]}`}>{payment.status.name}</span>
        </p>

        <p className="font-medium text-gray-900 dark:text-white">Назначение:</p>
        <textarea
            id="large-input" 
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-input-field"
            value={payment.n_p}
            readOnly
            disabled
            rows="auto"
            wrap="soft"
        ></textarea>

        {/* Client Payment Information */}
        {payment.client_payment_info && (        
        <div className="client-info mt-4">            
            <div className="grid grid-cols-2 gap-4" style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
            
            {/* Client Name */}
            <div className="form-group">
                <label htmlFor="client_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Клиент</label>               
                <select id="client_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 select-input">                    
                {payment.status.id === 1 ? (   
                    clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                    ))
                ) : (
                    <option value={payment.client_payment_info.client_name_id}>{payment.client_payment_info.client_name}</option>
                )}
                </select>
            </div>

            {/* City */}
            <div className="form-group">
            <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Город
            </label>
            <select
                id="city"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 select-input"
            >
                {payment.status.id === 1 ? (
                    cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                    ))
                ) : (
                    <option value={payment.client_payment_info.city_id}>
                        {payment.client_payment_info.city}
                    </option>
                )}
            </select>
            </div>

            {/* Street */}
            <div className="form-group">
            <label htmlFor="street" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Улица
            </label>
            <select
                id="street"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 select-input"
            >
                {payment.status.id === 1 ? (
                    <option value={null}>---</option>
                ) : (
                    <option value={payment.client_payment_info.street_id}>
                        {payment.client_payment_info.street}
                    </option>
                )}
            </select>
            </div>

            {/* House */}
            <div className="form-group">
            <label htmlFor="house" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Дом
            </label>
            <select
                id="house"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 select-input"
            >
                {payment.status.id === 1 ? (
                    <option value={null}>---</option>
                ) : (
                    <option value={payment.client_payment_info.house_id}>
                        {payment.client_payment_info.house}
                    </option>
                )}
            </select>
            </div>

            {/* Room */}
            <div className="form-group">
            <label htmlFor="room" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Квартира
            </label>
            <select
                id="room"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 select-input"
            >
                {payment.status.id === 1 ? (
                    <option value={null}>---</option>
                ) : (
                    <option value={payment.client_payment_info.room_id}>
                    {payment.client_payment_info.room}
                    </option>
                )}
            </select>
            </div>
            </div>
        </div>
        )}

        <div className="button-container-payment-card">
        <button onClick={() => navigate(`/`)} className="form-button-payment-card form-button-payment-card-back">
            Back
        </button>
        {payment.status.id === 1 && (
            <button className="form-button-payment-card form-button-payment-card-save">
            Save
            </button>
        )}
        </div>

      </Card>
    </div>
  );
}

export default PaymentCard;
