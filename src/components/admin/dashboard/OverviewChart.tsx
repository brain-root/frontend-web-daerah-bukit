import { useRef, useEffect } from "react";

interface OverviewChartProps {
  title: string;
  description?: string;
  type?: "bar" | "line";
}

interface ChartData {
  labels: string[];
  values: number[];
}

const OverviewChart = ({
  title,
  description,
  type = "bar",
}: OverviewChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // Example data for the chart - in a real app, this would come from props or API
  const data: ChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [30, 40, 35, 50, 49, 60],
  };

  // This is a placeholder for the chart implementation
  // In a real application, you would use a library like Chart.js, Recharts, etc.
  useEffect(() => {
    if (chartRef.current) {
      // Clear previous chart if any
      chartRef.current.innerHTML = "";

      // Create simple SVG chart visualization
      const svgWidth = chartRef.current.clientWidth;
      const svgHeight = 200;
      const padding = 30;

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", `${svgHeight}px`);

      const maxValue = Math.max(...data.values);

      // Draw axes
      const axisLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      axisLine.setAttribute("x1", `${padding}`);
      axisLine.setAttribute("y1", "10");
      axisLine.setAttribute("x2", `${padding}`);
      axisLine.setAttribute("y2", `${svgHeight - 40}`);
      axisLine.setAttribute("stroke", "#ccc");

      const bottomAxis = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      bottomAxis.setAttribute("x1", `${padding}`);
      bottomAxis.setAttribute("y1", `${svgHeight - 40}`);
      bottomAxis.setAttribute("x2", `${svgWidth - padding}`);
      bottomAxis.setAttribute("y2", `${svgHeight - 40}`);
      bottomAxis.setAttribute("stroke", "#ccc");

      svg.appendChild(axisLine);
      svg.appendChild(bottomAxis);

      // Calculate bar width and spacing
      const effectiveWidth = svgWidth - 2 * padding;
      const barWidth = (effectiveWidth / data.labels.length) * 0.7;
      const barSpacing = (effectiveWidth / data.labels.length) * 0.3;

      // Draw bars or line
      if (type === "bar") {
        data.values.forEach((value, index) => {
          const barHeight = (value / maxValue) * (svgHeight - 50);
          const x = padding + index * (barWidth + barSpacing);
          const y = svgHeight - 40 - barHeight;

          const bar = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
          );
          bar.setAttribute("x", x.toString());
          bar.setAttribute("y", y.toString());
          bar.setAttribute("width", barWidth.toString());
          bar.setAttribute("height", barHeight.toString());
          bar.setAttribute("fill", "#3B82F6");

          svg.appendChild(bar);

          // Add label
          const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );
          text.setAttribute("x", (x + barWidth / 2).toString());
          text.setAttribute("y", (svgHeight - 25).toString());
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("font-size", "10");
          text.setAttribute("fill", "#64748b");
          text.textContent = data.labels[index];

          svg.appendChild(text);
        });
      } else if (type === "line") {
        let pathData = "";

        data.values.forEach((value, index) => {
          const x =
            padding + index * (effectiveWidth / (data.labels.length - 1));
          const y = svgHeight - 40 - (value / maxValue) * (svgHeight - 50);

          if (index === 0) {
            pathData = `M ${x} ${y}`;
          } else {
            pathData += ` L ${x} ${y}`;
          }

          // Add points
          const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );
          circle.setAttribute("cx", x.toString());
          circle.setAttribute("cy", y.toString());
          circle.setAttribute("r", "4");
          circle.setAttribute("fill", "#3B82F6");

          svg.appendChild(circle);

          // Add label
          const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );
          text.setAttribute("x", x.toString());
          text.setAttribute("y", (svgHeight - 25).toString());
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("font-size", "10");
          text.setAttribute("fill", "#64748b");
          text.textContent = data.labels[index];

          svg.appendChild(text);
        });

        // Create path element
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("d", pathData);
        path.setAttribute("stroke", "#3B82F6");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("fill", "none");

        svg.appendChild(path);
      }

      chartRef.current.appendChild(svg);
    }
  }, [data, type]);

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
      <div className="mt-6" ref={chartRef}></div>
    </div>
  );
};

export default OverviewChart;
