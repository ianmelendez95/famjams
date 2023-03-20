import * as d3 from 'd3'
import type {Arc, DefaultArcObject, PieArcDatum} from "d3";
import type {UserProfile} from "@/spotify/types";

interface DonutChartData {
    user: UserProfile,
    value: number
}

interface AvatarInitialsTextData {
    y: number,
    text: string
}

export function buildDonut(data: DonutChartData[],
                           width: number): SVGSVGElement {
    // This is modified and extended work from Observable example.
    // Copyright 2021 Observable, Inc.
    // Released under the ISC license.
    // https://observablehq.com/@d3/donut-chart

    const innerRadius = width / 3 // inner radius of pie, in pixels (non-zero for donut)
    const outerRadius = width / 2 // outer radius of pie, in pixels
    const labelRadius = (innerRadius + outerRadius) / 2 // center radius of labels

    const padAngle = 6 / outerRadius // angular separation between wedges [1 ~= tan(1/outerRadius) * outerRadius, padAngle ~= padThickness / outerRadius]

    // Compute values.
    const N: string[] = d3.map(data, (d) => d.user.display_name);
    const V = d3.map(data, (d) => d.value);
    const I = d3.range(N.length);

    const userInitials: string[] = d3.map(data, d =>
        parseInitials(d.user.display_name)
    )
    const userImageUrls: string[] = d3.map(data, (d) => {
        if (d.user.images.length > 0) {
            return d.user.images[0].url
        } else {
            return ''
        }
    })

    const imageWidths = calcImageWidths(outerRadius - innerRadius, V)

    // Unique the names.
    const names = new d3.InternSet(N) as Set<string>;

    // Chose a default color scheme based on cardinality.
    const colors = d3.quantize((t: number) => d3.interpolateGreens(t * 0.6 + 0.2), names.size)
    const color = d3.scaleOrdinal(names, colors.slice().reverse());

    // Construct arcs.
    const arcs = d3.pie().padAngle(padAngle).sort(null).value((i) => V[i as number])(I) as PieArcDatum<number>[];
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius).cornerRadius(5) as Arc<any, DefaultArcObject>;
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", width)
        .attr("viewBox", [-width / 2, -width / 2, width, width])
        .attr("style", "height: auto; height: intrinsic;");

    svg.append("g")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", (d: PieArcDatum<number>) => color(N[d.data]))
        .attr("d", arc as any)
        .append("title")
        .text((d: PieArcDatum<number>) => N[d.data]);

    // append the images
    svg.append("g")
        .selectAll("image")
        .data(arcs.filter((d: PieArcDatum<number>) => userImageUrls[d.data].length > 0))
        .join("image")
        .attr("transform", (d: PieArcDatum<number>) => `translate(${imageTransform(imageWidths[d.data], arcLabel.centroid(d as any))})`)
        .attr("width", (d) => imageWidths[d.data])
        .attr("height", (d) => imageWidths[d.data])
        .attr("style", "clip-path: circle(closest-side)")  // https://developer.mozilla.org/en-US/docs/Web/CSS/basic-shape/circle
        .attr("xlink:href", (d) => userImageUrls[d.data])

    // append the letter avatars for those missing images
    svg.append("g")
        .selectAll("circle")
        .data(arcs.filter((d: PieArcDatum<number>) => userImageUrls[d.data].length == 0))
        .join("circle")
        .attr("transform", (d: PieArcDatum<number>) => `translate(${arcLabel.centroid(d as any)})`)
        .attr("width", (d) => imageWidths[d.data])
        .attr("height", (d) => imageWidths[d.data])
        .attr("r", (d) => imageWidths[d.data] / 2)
        .style("fill", "#B87333")

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("fill", "#eee")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs.filter((d: PieArcDatum<number>) => userImageUrls[d.data].length == 0))
        .join("text")
        .attr("font-size", d => (imageWidths[d.data] * 0.63))
        .attr("transform", d => `translate(${arcLabel.centroid(d as any)})`)
        .selectAll("tspan")
        .data<AvatarInitialsTextData>(d => [{
            y: imageWidths[d.data] * 0.24,
            text: userInitials[d.data]
        }])
        .join("tspan")
        .attr("x", 0)
        .attr("y", d => d.y)
        .attr("font-weight", "bold")
        .text(d => d.text);
    return Object.assign(svg.node() as SVGSVGElement, {scales: {color}});
}

function parseInitials(string: string): string {
    return string.split(/\s+/)
        .filter(w => w.length > 0)  // non-empty words
        .map(w => w[0])             // get first letter of each word
        .filter(c => c.match(/[a-z]/i))  // check that it is an alphabet letter
        .map(c => c.toUpperCase())                // make upper case
        .join('')                                 // join together
}

function calcImageWidths(arcWidth: number, values: number[]): number[] {
    const [min, max] = d3.extent(values) as [number, number]
    const props = values.map(v => (v - min) / (max - min))  // proportion to min, max

    return props.map(p => arcWidth * ((p * 0.45) + 0.50))

    // theta / 2*pi
    // const angleRatio = (arc.endAngle - arc.startAngle) / (2 * Math.PI)
    // const imageProportion = 0.25 + (0.70 * (1 + Math.log(angleRatio)))
    // return arcWidth * imageProportion
}

function imageTransform(width: number, [centerX, centerY]: [number, number]): [number, number] {
    return [centerX - (width / 2), centerY - (width / 2)]
}