import "./detail.scss";

import React, { useState, useEffect } from "react";
import axios from "axios";
import fileDownload from "js-file-download";

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

import Chart from "chart.js/auto";

const Detail = () => {
  const [date, setDate] = React.useState("");

  const handleChange = (event) => {
    setDate(event.target.value);
  };

  const loading = document.getElementsByClassName("loading");
  const loadingOverlay = document.getElementsByClassName("loading-overlay");

  useEffect(() => {
    //ChartJs
    const ctx = document.querySelector("#chart").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "20/03",
          "21/03",
          "22/03",
          "23/03",
          "24/03",
          "25/03",
          "26/03",
          "27/03",
          "28/03",
        ],
        datasets: [
          {
            data: [
              9000000, 40000000, 70000000, 30000000, 90000000, 60000000,
              110000000, 12000000, 120000000,
            ],
            label: "Icool",
            borderColor: "#ccc",
            backgroundColor: "#C9F4E8",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: "World population per region (in millions)",
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.yLabel;
            },
          },
        },
      },
    });
    if (myChart.id === 1) {
      myChart.destroy();
    }

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
    function download() {
      axios
        .get("http://192.168.137.1:3000/todo/export", {
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
          <div className="col-md-12 col-lg-3 detail__left">
            <FormControl fullWidth>
              <InputLabel
                id="demo-simple-select-label"
                className="detail-input__title"
              >
                Cửa hàng
              </InputLabel>
              <NativeSelect
                inputProps={{
                  name: "date",
                  id: "demo-simple-select",
                }}
                onChange={handleChange}
                defaultValue={10}
              >
                <option value={10}>Ung Văn Khiêm</option>
                <option value={20}>TP.HCM</option>
                <option value={30}>Hà Nội</option>
              </NativeSelect>
            </FormControl>
            <div className="detail-time">
              <div className="detail-title">Thời gian dự đoán</div>
              <Stack component="form" noValidate spacing={3}>
                <TextField
                  id="date"
                  label="Từ ngày"
                  type="date"
                  defaultValue="2022-03-20"
                  sx={{ width: 220 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  id="date"
                  label="Đến ngày"
                  type="date"
                  defaultValue="2022-03-28"
                  sx={{ width: 220 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Stack>
            </div>
            <Button variant="contained" className="detail-btn">
              Download
            </Button>
          </div>
          <div className="loading-overlay">
            <div className="spinner-border loading" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          <div className="col-md-12 col-lg-2"></div>
          <div className="col-md-12 col-lg-7 detail__chart">
            <div className="detail__chart--title">Biểu đồ dự đoán</div>
            <div className="detail__chart--desc">Doanh thu</div>
            <canvas id="chart" width="400" height="400"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
