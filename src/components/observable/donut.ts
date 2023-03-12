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

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/donut-chart
export function DonutChart(data: DonutChartData[],
                           nameFunction: (d: DonutChartData) => string,
                           valueFunction: (d: DonutChartData) => number): SVGSVGElement {
    const width = 640 // outer width, in pixels
    const height = 400 // outer height, in pixels
    const innerRadius = Math.min(width, height) / 3 // inner radius of pie, in pixels (non-zero for donut)
    const outerRadius = Math.min(width, height) / 2 // outer radius of pie, in pixels
    const labelRadius = (innerRadius + outerRadius) / 2 // center radius of labels
    const format = "," // a format specifier for values (in the label)
    const stroke = innerRadius > 0 ? "none" : "white" // stroke separating widths
    const strokeWidth = 1 // width of stroke separating wedges
    const strokeLinejoin = "round" // line join of stroke separating wedges
    const padAngle = stroke === "none" ? 1 / outerRadius : 0 // angular separation between wedges

    // Compute values.
    const N: string[] = d3.map(data, nameFunction);
    const V = d3.map(data, valueFunction);
    const I = d3.range(N.length);

    // Unique the names.
    const names = new d3.InternSet(N) as Set<string>;

    // Chose a default color scheme based on cardinality.
    const colors = d3.quantize((t: number) => d3.interpolateGreens(t * 0.6 + 0.2), names.size)

    // Construct scales.
    const color = d3.scaleOrdinal(names, colors.slice().reverse());

    // Compute titles.
    const title = (i: number | DonutChartData) => `${N[i as number]}\n${d3.format(format)(V[i as number])}`;

    // Construct arcs.
    const arcs = d3.pie().padAngle(padAngle).sort(null).value((i) => V[i as number])(I) as PieArcDatum<number>[];
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "height: auto; height: intrinsic;");

    svg.append("g")
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linejoin", strokeLinejoin)
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", (d: PieArcDatum<number>) => color(N[d.data]))
        .attr("d", arc as any)
        .append("title")
        .text((d: PieArcDatum<number>) => title!(d.data));

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", (d: PieArcDatum<number>) => `translate(${arcLabel.centroid(d as any)})`)
        .selectAll("tspan")
        .data((d: PieArcDatum<number>) => {
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