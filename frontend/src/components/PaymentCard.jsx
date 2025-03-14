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
  const [city, setCity] = useState(null);
  const [streets, setStreets] = useState([]);
  const [street, setStreet] = useState(null);
  const [houses, setHouses] = useState([]);
  const [house, setHouse] = useState(null);
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState(null);
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState(null);

  const statusStyle = {
    1: "status-process",
    3: "status-deleted",
    5: "status-success",
  };

  const handleSave = async () => {
    console.log("Saving payment...");
    console.log("➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖");
    console.log("Final data:");
    console.log(payment);
    console.log(client, city, street, house, location);
    console.log("➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖");
  };

  const onChangeCity = async (e) => {
    try {
      let cityId = e.target.value;
      setCity(cityId);
      const streetsResponse = await api.get(`/api/streets?city_id=${cityId}`);
      const streetsWithEmpty = [
        { id: -1, keyname: "---" },
        ...streetsResponse.data,
      ];
      setStreets(streetsWithEmpty);
      setHouses([{ id: -1, house: "---" }]);
      setLocations([{ id: -1, room: "---" }]);
      setClients([{ id: -1, keyname: "---" }]);
    } catch (err) {
      console.error("Ошибка при загрузке улиц: ", err);
    }
  };

  const onChangeStreet = async (e) => {
    try {
      let streetId = e.target.value;
      setStreet(streetId);
      const housesResponse = await api.get(`/api/houses?street_id=${streetId}`);
      const housesWithEmpty = [
        { id: -1, house: "---" },
        ...housesResponse.data,
      ];
      setHouses(housesWithEmpty);
      setLocations([{ id: -1, room: "---" }]);
      setClients([{ id: -1, keyname: "---" }]);
    } catch (err) {
      console.error("Ошибка при загрузке домов: ", err);
    }
  };

  const onChangeHouse = async (e) => {
    try {
      let houseId = e.target.value;
      setHouse(houseId);
      const locationsResponse = await api.get(
        `/api/locations?house_id=${houseId}`
      );
      const locationsWithEmpty = [
        { id: -1, room: "---" },
        ...locationsResponse.data,
      ];
      setLocations(locationsWithEmpty);
      setClients([{ id: -1, keyname: "---" }]);
    } catch (err) {
      console.error("Ошибка при загрузке квартир: ", err);
    }
  };

  const onChangeLocation = async (e) => {
    try {
      let locationId = e.target.value;
      setLocation(locationId);
      const clientsResponse = await api.get(
        `/api/clients?location_id=${locationId}`
      );
      const clientsWithEmpty = [
        { id: -1, keyname: "---" },
        ...clientsResponse.data,
      ];
      setClients(clientsWithEmpty);
    } catch (err) {
      console.error("Ошибка при загрузке клиентов: ", err);
    }
  };

  const onChangeClient = async (e) => {
    let clientId = e.target.value;
    setClient(clientId);
  };

  const fetchCities = async () => {
    try {
      const citiesResponse = await api.get("/api/cities/");
      const citiesWithEmpty = [{ id: -1, name: "---" }, ...citiesResponse.data];
      setCities(citiesWithEmpty);
      setCity(0);
      setStreet(0);
      setHouse(0);
      setLocation(0);
      setStreets([{ id: -1, keyname: "---" }]);
      setHouses([{ id: -1, house: "---" }]);
      setLocations([{ id: -1, room: "---" }]);
      setClients([{ id: -1, keyname: "---" }]);
    } catch (err) {
      console.error("Ошибка при загрузке городов: ", err);
    }
  };

  useEffect(() => {
    async function fetchPayment() {
      try {
        const response = await api.get(`/api/payments/${source}/${id}/`);
        if (response.data) {
          setPayment(response.data);
          if (response.data.status.id === 1) {
            fetchCities();
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
        <h5 className="text-xl font-bold text-gray-900">
          Платіж №{payment.num_doc}
        </h5>
        <p
          className="text-gray-700 flex"
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <span className="mr-4">
            Дата: {new Date(payment.date).toLocaleDateString()}
          </span>
          {payment.dt_load && (
            <span>
              Загрузка: {new Date(payment.dt_load).toLocaleDateString()}
            </span>
          )}
        </p>
        <p
          className="text-gray-700 flex"
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <span className="text-gray-900 font-semibold">
            Сума: {payment.sum} грн
          </span>
          {payment.name_bank && (
            <span className="text-gray-700">Банк: {payment.name_bank}</span>
          )}
        </p>
        <p className="font-medium text-gray-900 dark:text-white">
          Статус:{" "}
          <span className={`${statusStyle[payment.status.id]}`}>
            {payment.status.name}
          </span>
        </p>

        <p className="font-medium text-gray-900 dark:text-white">
          Призначення:
        </p>
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
            <div
              className="grid grid-cols-2 gap-4"
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* City */}
              <div className="form-group">
                <label
                  htmlFor="city"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Місто
                </label>
                <select
                  id="city"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 select-input"
                  onChange={onChangeCity}
                >
                  {payment.status.id === 1 ? (
                    cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
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
                <label
                  htmlFor="street"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Вулиця
                </label>
                <select
                  id="street"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 select-input"
                  onChange={onChangeStreet}
                >
                  {payment.status.id === 1 ? (
                    streets.map((street) => (
                      <option key={street.id} value={street.id}>
                        {street.keyname}
                      </option>
                    ))
                  ) : (
                    <option value={payment.client_payment_info.street_id}>
                      {payment.client_payment_info.street}
                    </option>
                  )}
                </select>
              </div>

              {/* House */}
              <div className="form-group">
                <label
                  htmlFor="house"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Будинок
                </label>
                <select
                  id="house"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 select-input"
                  onChange={onChangeHouse}
                >
                  {payment.status.id === 1 ? (
                    houses.map((house) => (
                      <option key={house.id} value={house.id}>
                        {house.house}
                      </option>
                    ))
                  ) : (
                    <option value={payment.client_payment_info.house_id}>
                      {payment.client_payment_info.house}
                    </option>
                  )}
                </select>
              </div>

              {/* Apartment */}
              <div className="form-group">
                <label
                  htmlFor="room"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Квартира
                </label>
                <select
                  id="room"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 select-input"
                  onChange={onChangeLocation}
                >
                  {payment.status.id === 1 ? (
                    locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.room}
                      </option>
                    ))
                  ) : (
                    <option value={payment.client_payment_info.room_id}>
                      {payment.client_payment_info.room}
                    </option>
                  )}
                </select>
              </div>

              {/* Client Name */}
              <div className="form-group">
                <label
                  htmlFor="client_name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Клієнт
                </label>
                <select
                  id="client_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 select-input"
                  onChange={onChangeClient}
                >
                  {payment.status.id === 1 ? (
                    clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.keyname}
                      </option>
                    ))
                  ) : (
                    <option value={payment.client_payment_info.client_name_id}>
                      {payment.client_payment_info.client_name}
                    </option>
                  )}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="button-container-payment-card">
          <button
            onClick={() => navigate(`/`)}
            className="form-button-payment-card form-button-payment-card-back"
          >
            Назад
          </button>
          {payment.status.id === 1 && (
            <button
              className="form-button-payment-card form-button-payment-card-save"
              onClick={handleSave}
            >
              Зберегти
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default PaymentCard;
