import Datepicker from "tailwind-datepicker-react";
import "../styles/DatePicker.css";
import { useState } from "react";
import "../styles/DatePicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
    // () => ReactElement | JSX.Element
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
  defaultDate: new Date("2024-01-01"),
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

function DatePicker({ setDate }) {
  const [show, setShow] = useState();
  const handleChange = (selectedDate) => {
    setDate(selectedDate);
  };
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
