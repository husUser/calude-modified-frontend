import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast } from "react-toastify";
import { axiosInstance } from "../../Utility/urlInstance.js";
import { buildBookingReportPdf } from "../../Utility/generateBookingReportPdf.js";
import classes from "./GenerateReport.module.css";

// 3 = admin, 4 = super-admin (same role numbers used by the Header and the backend)
const REPORT_ROLES = [3, 4];

const pad = (n) => String(n).padStart(2, "0");
// Built from local calendar parts (never toISOString) so the date can't shift by timezone.
const toISO = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toDMY = (d) =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

function GenerateReport() {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const isAllowed = REPORT_ROLES.includes(Number(auth?.userRole));

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!fromDate || !toDate) {
      toast.error("Please select both From Date and To Date.");
      return;
    }
    if (fromDate > toDate) {
      toast.error("From Date cannot be later than To Date.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get("/report/getBookingReport", {
        params: { fromDate: toISO(fromDate), toDate: toISO(toDate) },
        headers: { Authorization: authHeader },
      });

      const records = response?.data?.records || [];
      if (records.length === 0) {
        toast.warning("No booking records found for the selected date range.");
        return;
      }

      // Let the loader paint before the (synchronous) PDF build starts.
      await new Promise((resolve) => setTimeout(resolve, 0));

      const doc = buildBookingReportPdf({
        records,
        fromDate: toDMY(fromDate),
        toDate: toDMY(toDate),
      });
      doc.save(`Booking_Report_${toISO(fromDate)}_to_${toISO(toDate)}.pdf`);
      toast.success("Booking report generated.");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to generate the report. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAllowed) {
    return (
      <div className={classes.mainDash}>
        <MDBContainer fluid className="p-5 container">
          <div className={classes.deniedBox}>
            <h1 className="display-5 fw-bold text-white">Access denied</h1>
            <h5 className="text-white">
              Only Admin and Super Admin users can generate booking reports.
            </h5>
          </div>
        </MDBContainer>
      </div>
    );
  }

  return (
    <div className={classes.mainDash}>
      <MDBContainer fluid className="p-5 container">
        <MDBRow>
          <MDBCol md="6" className="text-center text-md-start">
            <h1 className="my-5 display-3 fw-bold text-white">
              Generate <span className="text-warning">Report</span>
            </h1>
            <h5 className="text-white">
              Select a date range and generate a PDF report of all bookings made
              in that period. The report is built from the permanent booking
              records, so bookings that were later cancelled or deleted are
              still included.
            </h5>
          </MDBCol>

          <MDBCol md="6">
            <MDBCard>
              <MDBCardBody className="p-5">
                <form onSubmit={handleGenerate} noValidate>
                  <h2 className="mb-4">Select Date Range</h2>

                  <div className={classes.fieldGroup}>
                    <label
                      htmlFor="report-from-date"
                      className={classes.fieldLabel}
                    >
                      From Date
                    </label>
                    <DatePicker
                      id="report-from-date"
                      selected={fromDate}
                      onChange={(date) => setFromDate(date)}
                      selectsStart
                      startDate={fromDate}
                      endDate={toDate}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="DD/MM/YYYY"
                      className="form-control"
                      wrapperClassName={classes.pickerWrapper}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      autoComplete="off"
                      disabled={loading}
                    />
                  </div>

                  <div className={classes.fieldGroup}>
                    <label
                      htmlFor="report-to-date"
                      className={classes.fieldLabel}
                    >
                      To Date
                    </label>
                    <DatePicker
                      id="report-to-date"
                      selected={toDate}
                      onChange={(date) => setToDate(date)}
                      selectsEnd
                      startDate={fromDate}
                      endDate={toDate}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="DD/MM/YYYY"
                      className="form-control"
                      wrapperClassName={classes.pickerWrapper}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      autoComplete="off"
                      disabled={loading}
                    />
                  </div>

                  <MDBBtn
                    className="w-100 mb-2"
                    size="md"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Generating Report...
                      </>
                    ) : (
                      "Generate Report"
                    )}
                  </MDBBtn>
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default GenerateReport;
