import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

var ws = null;

export default function App() {

  const [data, setData] = useState(
    {
      labels: ['0', '0', '0', '0', '0', '0'],
      datasets: [
        {
          data: [0, 0, 0, 0, 0, 0],
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
          strokeWidth: 2 // optional
        }
      ],
      legend: ["BTC-USD"]
    }
  );

  const screenWidth = Dimensions.get("window").width;

  const chartConfig = {
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  useEffect(() => {

    const subscribe = {
      type: "subscribe",
      channels: [
        {
          name: "ticker",
          product_ids: ["BTC-USD"]
        }
      ]
    };

    ws = new WebSocket("wss://ws-feed.gdax.com");

    ws.onopen = () => {
      ws.send(JSON.stringify(subscribe));
    }

    ws.onmessage = (e) => {

      let msg = JSON.parse(e.data);
      //console.log(msg);

      let labels = data.labels;
      let values = data.datasets[0].data;

      labels.splice(1, 1);
      values.splice(1, 1);
      if (msg.time && msg.price) {

        let time = msg.time;
        labels.push(time.slice(11, 19));
        values.push(parseInt(msg.price));

        setData(
          {
            labels: labels,
            datasets: [
              {
                data: values,
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                strokeWidth: 2 // optional
              }
            ],
            legend: ["BTC-USD " + time.slice(0, 10)]
          }
        );
      }

    };

  }, []);

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
