import "./detail.scss";

import React, { useState, useEffect, useRef } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

import axios from "axios";
import fileDownload from "js-file-download";

import * as dayjs from "dayjs";

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

import { store, obj, object } from "../../api/ObjectApi";

const Detail = () => {
  const [storeName, setStoreName] = useState(0);
  const detailChartRef = useRef(null);
  const [objStore, setObjStore] = useState(object);

  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const key = Object.keys(obj);
  const [labelInput, setLabelInput] = useState(key);

  const handleChange = (e) => {
    setStoreName(e.target.value);
  };

  // const convertArr = Object.entries(obj);
  const value = Object.values(obj);

  // const keyCount = key.map((item) => dayjs(item).format("DD/MM"));
  // console.log(value);

  const loading = document.getElementsByClassName("loading");
  const loadingOverlay = document.getElementsByClassName("loading-overlay");

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
  );
  const options = {
    responsive: true,
  };

  const labels = labelInput;

  const data = {
    labels,
    datasets: [
      {
        data: objStore.map((item, index) => objStore[index].count),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: true,
      },
    ],
  };

  // const native = document.getElementsByClassName("native");
  // native[0].addEventListener("change", (event) => {
  //   setStoreName(event.target.value);
  // });
  var getDaysArray = function (start, end) {
    for (
      var arr = [], dt = new Date(start);
      dt <= end;
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }
    return arr;
  };

  /** Gọi API để lấy dữ liệu gồm date1, date2, tên cửa hàng, số CH */
  const handleSubmit = () => {
    const index = store.findIndex((item) => item.count == storeName);

    var daylist = getDaysArray(new Date(fromDate), new Date(toDate));
    if (fromDate != null && toDate != null) {
      const listArr = daylist.map((v) =>
        dayjs(v.toISOString().slice(0, 10)).format("DD/MM")
      );
      setLabelInput(listArr);
    }

    setObjStore(store[index].object);
  };

  useEffect(() => {
    /**Gọi API để lấy dữ liệu ban đầu như: dữ liệu của cửa hàng đầu tiên */

    // const getInfo = async () => {
    //   await axios
    //     .post("http://127.0.0.1:5000/predict", {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(myDict),
    //     })
    //     .then((res) => console.log(res))
    //     .catch((error) => console.log(error));
    // };
    // getInfo();

    const from = document.getElementsByClassName("fromDate");
    const fromChild = from[0].children[1].children[0].value;
    setFromDate(fromChild);
    const to = document.getElementsByClassName("toDate");
    const toChild = to[0].children[1].children[0].value;
    setToDate(toChild);

    window.onload = () => {
      loading[0].classList.add("block");
      loadingOverlay[0].classList.add("block");
    };
    setTimeout(() => {
      window.scrollTo(0, 0);
      loading[0].classList.remove("block");
      loadingOverlay[0].classList.remove("block");
    }, 2000);

    // console.log(myChart.data.datasets[0].data);
    const btn = document.getElementsByClassName("detail-btn");

    /**Gọi API định dạng xlsx để export ra file excel */
    function download() {
      axios
        .get("apiExcel/here", {
          responseType: "blob",
        })
        .then((res) => {
          fileDownload(res.data, "file.xlsx");
        })
        .catch((err) => {
          console.log(err);
        });
    }
    btn[0].addEventListener("click", () => {
      download();
    });
  }, []);

  return (
    <div className="detail">
      <div className="container-fluid detail__wrap ">
        <div className="detail__body">
          <div className="col-12 col-md-12 col-lg-3 detail__left">
            <FormControl fullWidth>
              <InputLabel
                id="demo-simple-select-label"
                className="detail-input__title"
              >
                Cửa hàng
              </InputLabel>
              {store.length > 0 && (
                <NativeSelect
                  inputProps={{
                    name: "date",
                    id: "demo-simple-select",
                  }}
                  onChange={handleChange}
                  className="native"
                  defaultValue={0}
                >
                  {store.map((item, index) => (
                    <option value={item.count} key={index}>
                      {item.name}
                    </option>
                  ))}
                </NativeSelect>
              )}
            </FormControl>
            <div className="detail-time">
              <div className="detail-title">Thời gian dự đoán</div>
              <Stack component="form" spacing={3} className="wrap-input">
                <TextField
                  id="date"
                  label="Từ ngày"
                  type="date"
                  className="fromDate"
                  defaultValue="2022-04-05"
                  onChange={(e) => setFromDate(e.target.value)}
                  sx={{ width: 220 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  id="date"
                  label="Đến ngày"
                  type="date"
                  className="toDate"
                  defaultValue="2022-04-20"
                  onChange={(e) => setToDate(e.target.value)}
                  sx={{ width: 220 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Stack>
            </div>
            <Button
              variant="contained"
              className=" predict-btn"
              onClick={handleSubmit}
            >
              Predict
            </Button>
            <Button variant="contained" className="detail-btn">
              Download
            </Button>
          </div>
          <div className="loading-overlay">
            <div className="spinner-border loading" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-1"></div>
          <div className="col-12 col-sx-12 col-md-12 col-lg-8 ">
            <div className="detail__chart" ref={detailChartRef}>
              <div className="detail__chart--title">Biểu đồ dự đoán</div>
              <div className="detail__chart--desc">Doanh thu</div>
              <Line options={options} data={data} />;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
