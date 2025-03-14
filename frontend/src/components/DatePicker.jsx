import Datepicker from "tailwind-datepicker-react";
import "../styles/DatePicker.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function DatePicker({ date, setDate }) {
  // Define options for the Datepicker
  const options = {
    title: "Choose data",
    autoHide: true,
    todayBtn: false,
    clearBtn: true,
    clearBtnText: "Clear",
    maxDate: new Date("2100-01-01"),
    minDate: new Date("1950-01-01"),
    theme: {
      background: "dark:bg-gray-800",
      todayBtn: "",
      clearBtn: "",
      icons: "",
      text: "",
      disabledText: "",
      input: "date-picker",
      inputIcon: "",
      selected: "",
    },
    icons: {
      prev: () => (
        <span>
          <FontAwesomeIcon icon={faArrowLeft} />
        </span>
      ),
      next: () => (
        <span>
          <FontAwesomeIcon icon={faArrowRight} />
        </span>
      ),
    },
    datepickerClassNames: "top-12 datepicker-styles",
    defaultDate: date,
    language: "en",
    disabledDates: [],
    weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    inputNameProp: "date",
    inputIdProp: "date",
    inputPlaceholderProp: "Select Date",
    inputDateFormatProp: {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  };

  // State to control whether the datepicker is shown or not
  const [show, setShow] = useState(false);

  // Load the saved date from localStorage when the component mounts
  useEffect(() => {
    const savedDate = localStorage.getItem("selectedDate");
    if (savedDate) {
      setDate(new Date(savedDate));
    }
  }, [setDate]);

  // Handle date change and save it to localStorage
  const handleChange = (selectedDate) => {
    setDate(selectedDate);
    localStorage.setItem("selectedDate", selectedDate.toString());
  };

  // Close datepicker
  const handleClose = (state) => {
    setShow(state);
  };

  return (
    <Datepicker
      options={options}
      onChange={handleChange}
      show={show}
      setShow={handleClose}
    />
  );
}

export default DatePicker;
