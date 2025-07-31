
import React, { useState, useEffect } from "react";
// Hook para detectar si es móvil
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
}
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


const DateRangePicker = ({ value, onChange }) => {
  const today = new Date();
  const isMobile = useIsMobile();
  const [showModal, setShowModal] = useState(false);
  // Estado local para el rango temporal mientras el modal está abierto
  const [tempRange, setTempRange] = useState(value ? {
    startDate: value.start || value.startDate || startOfMonth(subMonths(today, 1)),
    endDate: value.end || value.endDate || endOfMonth(today),
    key: "selection",
  } : {
    startDate: startOfMonth(subMonths(today, 1)),
    endDate: endOfMonth(today),
    key: "selection",
  });
  // Controlar el mes inicial mostrado en el calendario
  const [calendarFocusDate, setCalendarFocusDate] = useState(startOfMonth(subMonths(today, 1)));

  // Abrir el modal y sincronizar el rango temporal con el valor externo
  const openModal = () => {
    setTempRange(value ? {
      startDate: value.start || value.startDate || startOfMonth(subMonths(today, 1)),
      endDate: value.end || value.endDate || endOfMonth(today),
      key: "selection",
    } : {
      startDate: startOfMonth(subMonths(today, 1)),
      endDate: endOfMonth(today),
      key: "selection",
    });
    setCalendarFocusDate(startOfMonth(subMonths(today, 1)));
    setShowModal(true);
  };

  // Al seleccionar fechas en el calendario
  const handleSelect = (ranges) => {
    setTempRange(ranges.selection);
  };

  // Al hacer clic en Aplicar
  const handleApply = () => {
    setShowModal(false);
    if (onChange) {
      onChange({
        start: tempRange.startDate.toISOString().slice(0, 10),
        end: tempRange.endDate.toISOString().slice(0, 10),
        startDate: tempRange.startDate,
        endDate: tempRange.endDate,
      });
    }
  };

  // Al hacer clic en Cancelar
  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="border rounded px-2 py-1 text-sm bg-white hover:bg-gray-100"
        onClick={openModal}
      >
        {(() => {
          // Asegura que value.start y value.end sean interpretados como fechas locales correctas
          const parseDate = d => {
            if (!d) return '';
            if (d instanceof Date) return d;
            // Si es string tipo 'YYYY-MM-DD', crear como local
            const [y, m, day] = d.split('-');
            return new Date(Number(y), Number(m) - 1, Number(day));
          };
          if (value && value.start && value.end) {
            const start = parseDate(value.start);
            const end = parseDate(value.end);
            const format = d => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
            return `${format(start)} - ${format(end)}`;
          }
          const format = d => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
          return `${format(tempRange.startDate)} - ${format(tempRange.endDate)}`;
        })()}
      </button>
      {showModal && (
        <div className="fixed z-20 inset-0 flex items-center justify-center bg-black/30">
          <div className="bg-white border rounded shadow-lg p-1 min-w-[320px] max-w-[98vw] sm:min-w-[760px] sm:max-w-[760px] flex flex-col">
            <RDRDateRangePicker
              onChange={item => handleSelect({ selection: item.selection })}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              direction={isMobile ? "vertical" : "horizontal"}
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
              ranges={[tempRange]}
              locale={es}
              className="!text-xs"
            />
            <div className="flex gap-2 justify-end mt-1">
              <button
                className="px-2 py-1 rounded bg-[#273958] text-white text-xs font-semibold hover:bg-[#1b263b]"
                onClick={handleApply}
              >
                Aplicar
              </button>
              <button
                className="px-2 py-1 rounded bg-gray-200 text-[#273958] text-xs font-semibold hover:bg-gray-300"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
