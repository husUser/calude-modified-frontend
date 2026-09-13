import React, { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import { axiosInstance } from "../../Utility/urlInstance";
import "./BookingTable.css";
import { MDBBtn } from "mdb-react-ui-kit";
import { useLocation } from "react-router-dom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import Header from "../../components/Header/Header";
import { toast } from "react-toastify";

function BookingTable() {
  // Maps keyed by `${time}-${yyyy-mm-dd}` -> status text (e.g. "Booked")
  const [bookedSlots, setBookedSlots] = useState({});
  const [bookedCells, setBookedCells] = useState({});
  const [bookings, setBookings] = useState([]);
  const [blockingData, setBlockingData] = useState([]);
  const [lastSunday, setLastSunday] = useState(null);

  const auth = useAuthUser();
  const userID = auth?.userId;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const equipmentId = queryParams.get("equipmentId");

  useEffect(() => {
    if (equipmentId) {
      fetchBookingStatus();
      fetchBlockingStatus();
    }
  }, [equipmentId]);

  // compute start date - the upcoming (or current) Monday as in your original logic
  const startDate = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const offsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + offsetToMonday);
    // normalize time to local midnight for safety
    monday.setHours(0, 0, 0, 0);
    return monday;
  }, []);

  const daysOfWeek = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      day.setHours(0, 0, 0, 0);
      return day;
    });
  }, [startDate]);

  useEffect(() => {
    if (daysOfWeek.length > 0) {
      const lastDay = daysOfWeek[13];
      const lastDayName = lastDay.toLocaleDateString("en-US", {
        weekday: "long",
      });
      if (lastDayName === "Sunday") {
        const formattedDate = lastDay.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        });
        setLastSunday(formattedDate);
      }
    }
  }, [daysOfWeek]);

  // -------------------------
  // Helpers: parse date/time
  // -------------------------

  // canonical ISO date key using LOCAL date parts: yyyy-mm-dd (no UTC)
  const toIsoKey = (dateObj) => {
    if (!dateObj) return null;
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Parse backend slotDate robustly and return a Date object at LOCAL midnight (or null)
  const parseSlotDateToDate = (slotDateStr) => {
    if (!slotDateStr) return null;

    const s = String(slotDateStr).trim();

    // dd/mm/yyyy
    const dmY = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dmY) {
      const day = parseInt(dmY[1], 10);
      const month = parseInt(dmY[2], 10) - 1;
      const year = parseInt(dmY[3], 10);
      const d = new Date(year, month, day);
      d.setHours(0, 0, 0, 0);
      return d;
    }

    // yyyy-mm-dd (explicit parse to local midnight)
    const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
      const year = parseInt(isoMatch[1], 10);
      const month = parseInt(isoMatch[2], 10) - 1;
      const day = parseInt(isoMatch[3], 10);
      const d = new Date(year, month, day);
      d.setHours(0, 0, 0, 0);
      return d;
    }

    // fallback to Date parse (last resort) and normalise to local midnight
    const fallback = new Date(s);
    if (!Number.isNaN(fallback.getTime())) {
      fallback.setHours(0, 0, 0, 0);
      return fallback;
    }

    return null;
  };

  // parse a single time token like "9AM" or "09:30PM" => minutes since midnight
  const parseTimeTokenToMinutes = (token) => {
    if (!token) return 0;
    const t = token.trim().toUpperCase();
    // match hour(:min)? + AM/PM
    const m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
    if (!m) {
      // fallback: try numeric hour only
      const h = parseInt(t, 10);
      if (!isNaN(h)) return h * 60;
      return 0;
    }
    let hour = parseInt(m[1], 10);
    const mins = m[2] ? parseInt(m[2], 10) : 0;
    const mod = m[3].toUpperCase();
    if (mod === "PM" && hour !== 12) hour += 12;
    if (mod === "AM" && hour === 12) hour = 0;
    return hour * 60 + mins;
  };

  // check whether time slot (e.g. "9AM-10AM") on a given dayDate is already in the past
  const isPastTimeSlot = (timeRange, dayDate) => {
    if (!dayDate) return false;
    const now = new Date();
    // local midnight today
    const todayStart = new Date(now.toDateString());
    if (dayDate < todayStart) return true;

    // if same day, compare end time vs now
    const [startToken = "", endToken = ""] = timeRange.split("-");
    const endMinutes = parseTimeTokenToMinutes(endToken);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return (
      dayDate.toDateString() === now.toDateString() &&
      currentMinutes >= endMinutes
    );
  };

  // -------------------------
  // Fetch booked slots
  // -------------------------
  const fetchBookingStatus = async () => {
    if (!equipmentId) return;
    try {
      const response = await axiosInstance.get(
        `/booking/status/${equipmentId}`,
      );
      const bookingsFromServer = response?.data || [];

      // bookingsFromServer expected to be array of objects with slotDate & slotTime & bookingStatus
      const slotsMap = {};

      bookingsFromServer.forEach((b) => {
        const { slotDate, slotTime, bookingStatus } = b;
        const dateObj = parseSlotDateToDate(slotDate);
        if (!dateObj) return;
        const dateKey = toIsoKey(dateObj); // yyyy-mm-dd local
        const key = `${slotTime}-${dateKey}`;
        // Normalize status text for display
        const statusText =
          typeof bookingStatus === "string"
            ? bookingStatus // if backend already sends 'Booked' or similar
            : "Booked";
        slotsMap[key] = statusText || "Booked";
      });

      setBookedSlots(slotsMap);
    } catch (error) {
      console.error("Error fetching booking status:", error);
      setBookedSlots({});
    }
  };

  // -------------------------
  // Fetch blocking (manual blocks)
  // -------------------------
  const fetchBlockingStatus = async () => {
    try {
      const response = await axiosInstance.get(`/blocking/getAllBlocking`);
      const bd = response?.data?.data ?? response?.data ?? [];
      // ensure array
      if (Array.isArray(bd)) {
        setBlockingData(bd);
      } else {
        setBlockingData([]);
      }
    } catch (error) {
      // if API returns "No blocking records found." handle gracefully
      const msg = error?.response?.data?.errors?.[0];
      if (msg === "No blocking records found.") {
        setBlockingData([]);
      } else {
        console.error("Error fetching blockingData:", error);
        setBlockingData([]);
      }
    }
  };

  // -------------------------
  // Click / Submit handlers
  // -------------------------
  const handleCellClick = (time, dayIndex) => {
    const dayDate = daysOfWeek[dayIndex];
    if (!dayDate) return;
    const isoDate = toIsoKey(dayDate);
    const cellKey = `${time}-${isoDate}`;

    if (bookedCells[cellKey] || bookedSlots[cellKey]) return;

    setBookedCells((prev) => ({
      ...prev,
      [cellKey]: true,
    }));

    setBookings((prev) => [
      ...prev,
      {
        timeSlot: time,
        slotDate: isoDate, // use ISO date for submission (local yyyy-mm-dd)
        bookingDate: toIsoKey(new Date()), // local today yyyy-mm-dd
      },
    ]);
  };

  // const handleSubmit = async () => {
  //   if (!equipmentId) {
  //     alert("Problem with selecting equipment. Please try again.");
  //     return;
  //   }

  //   if (bookings.length === 0) {
  //     alert("No bookings selected!");
  //     return;
  //   }

  //   const payload = {
  //     equipmentId,
  //     bookingsCount: bookings.length,
  //     bookings,
  //     userID,
  //   };

  //   try {
  //     const response = await axiosInstance.post("/booking/equipmentBookings", payload);
  //     alert(response?.data?.message || "Bookings submitted successfully");

  //     // Clear local selections (bookedCells & bookings)
  //     setBookings([]);
  //     setBookedCells({});

  //     // refresh server status so booked slots show as booked
  //     await fetchBookingStatus();
  //   } catch (error) {
  //     console.error("Error submitting booking:", error);
  //     alert("Error submitting booking.");
  //   }
  // };
  const handleSubmit = async () => {
    if (!equipmentId) {
      toast.error("Problem with selecting equipment. Please try again.");
      return;
    }

    if (bookings.length === 0) {
      toast.warning("No bookings selected!");
      return;
    }

    const payload = {
      equipmentId,
      bookingsCount: bookings.length,
      bookings,
      userID,
    };

    try {
      const response = await axiosInstance.post(
        "/booking/equipmentBookings",
        payload,
      );
      toast.success(
        response?.data?.message || "Bookings submitted successfully!",
      );

      // Reset local state
      setBookings([]);
      setBookedCells({});
      await fetchBookingStatus();
    } catch (error) {
      console.log(error);
      console.log(
        error?.response.data.message ||
          "Error submitting booking please try again",
      );
      toast.error(
        error?.response.data.message ||
          "Error submitting booking please try again",
      );
    }
  };
  // -------------------------
  // Table columns & data
  // -------------------------
  const data = useMemo(
    () =>
      [
        { Time: "9AM-10AM" },
        { Time: "10AM-11AM" },
        { Time: "11AM-12PM" },
        { Time: "12PM-1PM" },
        { Time: "2PM-3PM" },
        { Time: "3PM-4PM" },
        { Time: "4PM-5PM" },
      ].map((row) => ({
        ...row,
        ...Object.fromEntries(
          Array(14)
            .fill(null)
            .map((_, i) => [`Day${i}`, "Book"]),
        ),
      })),
    [],
  );

  const columns = useMemo(() => {
    return [
      { Header: "Time", accessor: "Time" },
      ...daysOfWeek.map((date, index) => ({
        Header: date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        }),
        accessor: `Day${index}`,
      })),
    ];
  }, [daysOfWeek]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  // -------------------------
  // Render
  // -------------------------
  return (
    <div className="">
      <Header />
      <div className="container">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, cellIndex) => {
                    const time = row.values.Time;
                    const dayIndex = cellIndex - 1;
                    const isTimeColumn = cell.column.id === "Time";
                    const dayDate = daysOfWeek[dayIndex];
                    const isoDate = dayDate ? toIsoKey(dayDate) : null;
                    const cellKey = isoDate
                      ? `${time}-${isoDate}`
                      : `col-${cellIndex}-${time}`;

                    // Check booked (from server) and local selected booked
                    const serverBookingStatus = isoDate
                      ? bookedSlots[cellKey]
                      : undefined;
                    const isServerBooked = !!serverBookingStatus;
                    const isLocallySelected = !!bookedCells[cellKey];

                    // Determine if the day is blocked by blockingData
                    let isBlockedByBlocking = false;
                    let blockingMessage = null;
                    if (Array.isArray(blockingData) && dayDate) {
                      // try to find a blocking record that matches the day (supporting expected schema)
                      const currentYear = dayDate.getFullYear();
                      const matched = blockingData.find((block) => {
                        // if backend provides blockingDate or a composite blockingMonth & blockingNumber
                        if (block.blockingDate) {
                          const bdDate =
                            parseSlotDateToDate(block.blockingDate) ||
                            new Date(block.blockingDate);
                          if (!Number.isNaN(bdDate.getTime())) {
                            bdDate.setHours(0, 0, 0, 0);
                            return toIsoKey(bdDate) === isoDate;
                          }
                        }
                        if (block.blockingMonth && block.blockingNumber) {
                          const blockedDateString = `${block.blockingNumber} ${block.blockingMonth} ${currentYear}`;
                          const bd = new Date(blockedDateString);
                          if (!Number.isNaN(bd.getTime())) {
                            bd.setHours(0, 0, 0, 0);
                            return toIsoKey(bd) === isoDate;
                          }
                        }
                        return false;
                      });

                      if (matched) {
                        isBlockedByBlocking = true;
                        blockingMessage = matched.blockingMessage || "Blocked";
                      }
                    }

                    // Build cell style & text
                    let cellStyle = {};
                    let cellText = cell.value;

                    if (isTimeColumn) {
                      cellStyle = {
                        backgroundColor: "#0A7075",
                        color: "white",
                      };
                    } else if (dayDate) {
                      const dayOfWeek = dayDate.getDay();

                      // weekend -> Holiday
                      if (dayOfWeek === 6 || dayOfWeek === 0) {
                        cellStyle = {
                          backgroundColor: "#54162B",
                          color: "white",
                          cursor: "not-allowed",
                        };
                        cellText = "Holiday";
                      }
                      // blocking days (manual block)
                      else if (isBlockedByBlocking) {
                        cellStyle = {
                          backgroundColor: "lightcoral",
                          color: "white",
                          cursor: "not-allowed",
                        };
                        cellText = blockingMessage || "Blocked";
                      }
                      // past time slots
                      else if (
                        isPastTimeSlot(time, dayDate) &&
                        !isServerBooked &&
                        !isLocallySelected
                      ) {
                        cellStyle = {
                          backgroundColor: "black",
                          color: "white",
                          cursor: "not-allowed",
                        };
                        cellText = "Closed without booking";
                      }
                      // server-booked slots (already booked in DB) -> show Booked
                      else if (isServerBooked) {
                        cellStyle = {
                          backgroundColor: "lightcoral",
                          color: "white",
                          cursor: "not-allowed",
                        };
                        cellText = serverBookingStatus || "Booked";
                      }
                      // locally selected (user clicked but not yet submitted)
                      else if (isLocallySelected) {
                        cellStyle = {
                          backgroundColor: "#6aa2d6",
                          color: "white",
                          cursor: "pointer",
                        }; // highlight selection
                        cellText = "Selected";
                      } else {
                        // default available "Book"
                        cellStyle = {};
                        cellText = "Book";
                      }
                    }

                    const clickable =
                      !isTimeColumn &&
                      !isServerBooked &&
                      !isBlockedByBlocking &&
                      cellText !== "Holiday" &&
                      cellText !== "Closed without booking";

                    return (
                      <td
                        {...cell.getCellProps()}
                        key={cellKey}
                        style={cellStyle}
                        onClick={() => {
                          if (!isTimeColumn && clickable) {
                            handleCellClick(time, dayIndex);
                          }
                        }}
                      >
                        {cellText}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        <MDBBtn className="m-2" color="success" onClick={handleSubmit}>
          Continue
        </MDBBtn>
      </div>
    </div>
  );
}

export default BookingTable;
