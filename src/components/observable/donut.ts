import * as d3 from 'd3'
import type {BaseType, DefaultArcObject, PieArcDatum} from "d3";

export const DATA: DonutChartData[] = [
    { name: "<5",    value: 19912018 },
    { name: "5-9",   value: 20501982 },
    { name: "10-14", value: 20679786 },
    { name: "15-19", value: 21354481 },
    { name: "20-24", value: 22604232 },
    { name: "25-29", value: 21698010 },
    { name: "30-34", value: 21183639 },
    { name: "35-39", value: 19855782 },
    { name: "40-44", value: 20796128 },
    { name: "45-49", value: 21370368 },
    { name: "50-54", value: 22525490 },
    { name: "55-59", value: 21001947 },
    { name: "60-64", value: 18415681 },
    { name: "65-69", value: 14547446 },
    { name: "70-74", value: 10587721 },
    { name: "75-79", value: 7730129 },
    { name: "80-84", value: 5811429 },
    { name: "≥85",   value: 5938752 }
]

interface DonutChartData {
    name: string,
    value: number
}

interface DonutChartOptions {
    name?: (xs: DonutChartData) => string,  // given d in data, returns the (ordinal) label
    value?: (xs: DonutChartData) => number, // given d in data, returns the (quantitative) value
    title?: (d: DonutChartData | number, i?: number, data?: DonutChartData[]) => string, // given d in data, returns the title text
    width?: number, // outer width, in pixels
    height?: number, // outer height, in pixels
    innerRadius?: number, // inner radius of pie, in pixels (non-zero for donut)
    outerRadius?: number, // outer radius of pie, in pixels
    labelRadius?: number, // center radius of labels
    format?: string, // a format specifier for values (in the label)
    names?: string[] | Set<string>, // array of names (the domain of the color scale)
    colors?: readonly string[], // array of colors for names
    stroke?: string, // stroke separating widths
    strokeWidth?: number, // width of stroke separating wedges
    strokeLinejoin?: string, // line join of stroke separating wedges
    padAngle?: number, // angular separation between wedges
}

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/donut-chart
export function DonutChart(data: DonutChartData[], {
    name,  // given d in data, returns the (ordinal) label
    value, // given d in data, returns the (quantitative) value
    title, // given d in data, returns the title text
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    innerRadius = Math.min(width, height) / 3, // inner radius of pie, in pixels (non-zero for donut)
    outerRadius = Math.min(width, height) / 2, // outer radius of pie, in pixels
    labelRadius = (innerRadius + outerRadius) / 2, // center radius of labels
    format = ",", // a format specifier for values (in the label)
    names, // array of names (the domain of the color scale)
    colors, // array of colors for names
    stroke = innerRadius > 0 ? "none" : "white", // stroke separating widths
    strokeWidth = 1, // width of stroke separating wedges
    strokeLinejoin = "round", // line join of stroke separating wedges
    padAngle = stroke === "none" ? 1 / outerRadius : 0, // angular separation between wedges
}: DonutChartOptions = {}): SVGSVGElement {
    // Compute values.
    const N: string[] = d3.map(data, name!);
    const V = d3.map(data, value!);
    const I = d3.range(N.length).filter((i: number) => !isNaN(V[i]));

    // Unique the names.
    if (names === undefined) names = N;
    names = new d3.InternSet(names) as Set<string>;

    // Chose a default color scheme based on cardinality.
    if (colors === undefined) colors = d3.schemeGreens[names.size];
    if (colors === undefined) colors = d3.quantize((t: number) => d3.interpolateGreens(t * 0.5 + 0.4), names.size);

    // Construct scales.
    colors = colors.slice().reverse()
    const color = d3.scaleOrdinal(names, colors);

    // Compute titles.
    if (title === undefined) {
        const formatValue = d3.format(format);
        title = (i: number | DonutChartData) => `${N[i as number]}\n${formatValue(V[i as number])}`;
    } else {
        const O: DonutChartData[] = d3.map(data, (d: DonutChartData) => d);
        const T = title;
        title = (i: number | DonutChartData) => T(O[i as number], i as number, data);
    }

    // Construct arcs.
    const arcs = d3.pie().padAngle(padAngle).sort(null).value((i) => V[i as number])(I);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linejoin", strokeLinejoin)
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", (d: PieArcDatum<any>) => color(N[d.data]))
        .attr("d", arc as any)
        .append("title")
        .text((d: PieArcDatum<any>) => title!(d.data));

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", (d: unknown) => `translate(${arcLabel.centroid(d as DefaultArcObject)})`)
        .selectAll("tspan")
        .data((d: PieArcDatum<any>) => {
            const lines = `${title!(d.data)}`.split(/\n/);
            return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
        })
        .join("tspan")
        .attr("x", 0)
        .attr("y", (_: string, i: number) => `${i * 1.1}em`)
        .attr("font-weight", (_: string, i: number) => i ? null : "bold")
        .text(d => d);

    return Object.assign(svg.node() as SVGSVGElement, {scales: {color}});
}