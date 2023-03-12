import * as d3 from 'd3'
import type {PieArcDatum} from "d3";
import type {UserProfile} from "@/spotify/types";

interface DonutChartData {
    user: UserProfile,
    value: number
}

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/donut-chart
export function DonutChart(data: DonutChartData[]): SVGSVGElement {
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
    const N: string[] = d3.map(data, (d) => d.user.display_name);
    const V = d3.map(data, (d) => d.value);
    const I = d3.range(N.length);
    const userImageUrls: string[] = d3.map(data, (d) => d.user.images[0].url) // TODO - confirm what happens with no profile picture

    const imageWidth = (outerRadius - innerRadius) * 0.75

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
        .text((d: PieArcDatum<number>) => title(d.data));

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("image")
        .attr("transform", (d: PieArcDatum<number>) => `translate(${imageTransform(imageWidth, arcLabel.centroid(d as any))})`)
        .attr("width", imageWidth)
        .attr("height", imageWidth)
        .attr("xlink:href", (d) => userImageUrls[d.data])

        // .join("text")
        // .attr("transform", (d: PieArcDatum<number>) => `translate(${arcLabel.centroid(d as any)})`)
        // .selectAll("tspan")
        // .data((d: PieArcDatum<number>) => {
        //     const lines = `${title(d.data)}`.split(/\n/);
        //     return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
        // })
        // .join("tspan")
        // .attr("x", 0)
        // .attr("y", (_: string, i: number) => `${i * 1.1}em`)
        // .attr("font-weight", (_: string, i: number) => i ? null : "bold")
        // .text(d => d);

    return Object.assign(svg.node() as SVGSVGElement, {scales: {color}});
}

function imageTransform(width: number, [centerX, centerY]: [number, number]): [number, number] {
    return [centerX - (width / 2), centerY - (width / 2)]
}