import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { AuthContext } from "@/contexts/AuthContext";

interface WidgetConfig {
  timeRangeStart?: string;
  timeRangeEnd?: string;
  [key: string]: any;
}

export const LineChartWidget = ({ widget }: { widget: any }) => {
  const { token } = useContext(AuthContext);
  const [series, setSeries] = useState<{ x: string; y: number }[]>([]);

  let config: WidgetConfig = {};
  try {
    config = JSON.parse(widget?.jsonBlob || "{}");
  } catch (err) {
    console.warn("JSON Parse Error in LineChartWidget:", widget?.id, err);
  }

  const unit = widget.properties?.[0]?.unitInfo?.abbreviation ?? "";
  const title = widget.title ?? "Diagramm";

  useEffect(() => {
    const prop = widget.properties?.[0];
    if (!prop || !config.timeRangeStart || !config.timeRangeEnd || !token)
      return;

    const from = new Date(config.timeRangeStart);
    from.setHours(0, 0, 0, 0);
    const to = new Date(config.timeRangeEnd);
    to.setHours(23, 59, 59, 999);

    const baseUrl =
      "https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/taskmanagement/properties/values";
    const url = `${baseUrl}?propertyDraftId=${prop.propertyDraftId}&elementId=${
      prop.elementId
    }&fromDateTime=${encodeURIComponent(
      from.toISOString()
    )}&toDateTime=${encodeURIComponent(to.toISOString())}`;

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const transformed = data.map((d: any) => ({
            x: new Date(d.timestamp).toLocaleDateString("de-AT"),
            y: d.value,
          }));
          setSeries(transformed);
        }
      })
      .catch((err) => {
        console.warn("Fehler beim Laden der Chart-Daten:", err);
      });
  }, [widget, token]);

  const option = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: series.map((v) => v.x),
    },
    yAxis: {
      type: "value",
      name: unit,
    },
    series: [
      {
        data: series.map((v) => v.y),
        type: "line",
        smooth: true,
      },
    ],
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style> html, body, #chart { margin: 0; height: 100%; } </style>
        <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
      </head>
      <body>
        <div id="chart"></div>
        <script>
          const chart = echarts.init(document.getElementById('chart'));
          chart.setOption(${JSON.stringify(option)});
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={{ height: 200 }}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 200,
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
});
