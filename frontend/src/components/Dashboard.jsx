import React, { useState, useEffect } from "react";
import socket from "../socket";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MAX_DATA_POINTS = 30; // Show last 30 data points

const Dashboard = () => {
  const [data, setData] = useState({ moisture: 0, soil_temperature: 0 });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const handleSensorUpdate = (newData) => {
      setData((prevData) => ({
        ...prevData,
        moisture: newData.moisture ?? 0,
        soil_temperature: newData.soil_temperature ?? 0,
      }));
      setHistory((prevHistory) => {
        const next = [
          ...prevHistory,
          {
            time: new Date().toLocaleTimeString(),
            moisture: newData.moisture ?? 0,
            soil_temperature: newData.soil_temperature ?? 0,
          },
        ];
        return next.length > MAX_DATA_POINTS
          ? next.slice(-MAX_DATA_POINTS)
          : next;
      });
    };

    socket.on("sensorUpdate", handleSensorUpdate);
    return () => {
      socket.off("sensorUpdate", handleSensorUpdate);
    };
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f6fa", p: 4 }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography
                variant="h4"
                gutterBottom
                align="center"
                sx={{ fontWeight: 700 }}
              >
                Real-Time Soil Sensor Dashboard
              </Typography>
              <Grid
                container
                spacing={2}
                justifyContent="center"
                sx={{ mb: 2 }}
              >
                <Grid item>
                  <Box
                    sx={{
                      bgcolor: "#e3f2fd",
                      p: 2,
                      borderRadius: 2,
                      minWidth: 180,
                    }}
                  >
                    <Typography variant="subtitle1" color="textSecondary">
                      Soil Moisture
                    </Typography>
                    <Typography
                      variant="h5"
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    >
                      {data.moisture.toFixed(2)} %
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box
                    sx={{
                      bgcolor: "#fff3e0",
                      p: 2,
                      borderRadius: 2,
                      minWidth: 180,
                    }}
                  >
                    <Typography variant="subtitle1" color="textSecondary">
                      Soil Temperature
                    </Typography>
                    <Typography
                      variant="h5"
                      color="secondary"
                      sx={{ fontWeight: 600 }}
                    >
                      {data.soil_temperature.toFixed(2)} °C
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" minTickGap={20} />
                    <YAxis yAxisId="left" domain={[0, 100]} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={["auto", "auto"]}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="moisture"
                      stroke="#1976d2"
                      strokeWidth={2}
                      dot={false}
                      name="Moisture (%)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="soil_temperature"
                      stroke="#ff9800"
                      strokeWidth={2}
                      dot={false}
                      name="Temperature (°C)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
