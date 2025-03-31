"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const subscriber_1 = require("./subscriber");
// Main server logic
console.log('Server: Starting...');
// Register callback to print data from subscriber
subscriber_1.subscriber.onData((data) => {
    console.log(`Server: Received - Temperature: ${data.temperature.toFixed(1)}°C, Humidity: ${data.humidity.toFixed(1)}%`);
});
