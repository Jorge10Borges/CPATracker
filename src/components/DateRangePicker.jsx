
import React, { useState } from "react";
import { DateRangePicker as RDRDateRangePicker, createStaticRanges } from "react-date-range";
import {
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  subDays,
  startOfDay,
  endOfDay,
  startOfYear,
  endOfYear,
  subWeeks,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";


const customStaticRanges = createStaticRanges([
  {
    label: "Hoy",
    range: () => ({
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
    }),
  },
  {
    label: "Ayer",
    range: () => {
      const d = subDays(new Date(), 1);
      return {
        startDate: startOfDay(d),
        endDate: endOfDay(d),
      };
    },
  },
  {
    label: "Esta semana",
    range: () => ({
      startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
      endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
    }),
  },
  {
    label: "Última semana",
    range: () => {
      const lastWeek = subWeeks(new Date(), 1);
      return {
        startDate: startOfWeek(lastWeek, { weekStartsOn: 1 }),
        endDate: endOfWeek(lastWeek, { weekStartsOn: 1 }),
      };
    },
  },
  {
    label: "Este mes",
    range: () => ({
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
    }),
  },
  {
    label: "Mes anterior",
    range: () => {
      const lastMonth = subMonths(new Date(), 1);
      return {
        startDate: startOfMonth(lastMonth),
        endDate: endOfMonth(lastMonth),
      };
    },
  },
  {
    label: "Este año",
    range: () => ({
      startDate: startOfYear(new Date()),
      endDate: endOfYear(new Date()),
    }),
  },
]);

const DateRangePicker = ({ onChange }) => {

  const today = new Date();
  const [showModal, setShowModal] = useState(false);
  // Por defecto, mostrar el mes anterior y el actual
  const [range, setRange] = useState({
    startDate: startOfMonth(subMonths(today, 1)),
    endDate: endOfMonth(today),
    key: "selection",
  });
  // Controlar el mes inicial mostrado en el calendario
  const [calendarFocusDate, setCalendarFocusDate] = useState(startOfMonth(subMonths(today, 1)));

  const handleSelect = (ranges) => {
    setRange(ranges.selection);
    if (onChange) onChange(ranges.selection);
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="border rounded px-2 py-1 text-sm bg-white hover:bg-gray-100"
        onClick={() => {
          setCalendarFocusDate(startOfMonth(subMonths(today, 1)));
          setShowModal(true);
        }}
      >
        {range.startDate.toLocaleDateString()} - {range.endDate.toLocaleDateString()}
      </button>
      {showModal && (
        <div className="absolute z-20 left-0 mt-2 bg-white border rounded shadow-lg p-2 min-w-[600px] flex">
          <RDRDateRangePicker
            onChange={item => handleSelect({ selection: item.selection })}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            direction="horizontal"
            minDate={new Date(2000, 0, 1)}
            maxDate={endOfMonth(today)}
            rangeColors={["#273958"]}
            weekdayDisplayFormat="EEEEE"
            showDateDisplay={false}
            staticRanges={customStaticRanges}
            inputRanges={[]}
            renderStaticRangeLabel={range => range.label}
            initialFocusedDate={calendarFocusDate}
            sidebarPosition="left"
            ranges={[range]}
            locale={es}
          />
          <div className="flex flex-col justify-end ml-2">
            <button
              className="text-xs text-gray-500 hover:underline"
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
