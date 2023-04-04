import * as d3 from 'd3'
import type {Arc, DefaultArcObject, PieArcDatum} from "d3";
import type {UserProfile} from "@/spotify/types";

export interface DonutChartData {
    user: UserProfile,
    value: number
}

interface AvatarInitialsTextData {
    y: number,
    text: string
}

export function loadDonut(donutDiv: HTMLDivElement, data: DonutChartData[]) {
    const width = donutDiv.getBoundingClientRect().width
    donutDiv.append(buildDonut(data, width))
}

export function buildDonut(data: DonutChartData[],
                           width: number): SVGSVGElement {
    // This is modified and extended work from Observable example.
    // Copyright 2021 Observable, Inc.
    // Released under the ISC license.
    // https://observablehq.com/@d3/donut-chart
    //
    // Extended to support Spotify user image urls and
    // avatar SVG generation (see 'letter avatars' in comments below)

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

    // Unique the names.
    const names = new d3.InternSet(N) as Set<string>;

    // Chose a default color scheme based on cardinality.
    const colors = d3.quantize((t: number) => d3.interpolateGreens(t * 0.6 + 0.2), names.size)
    const color = d3.scaleOrdinal(names, colors.slice().reverse());

    // Construct arcs.
    const arcs = d3.pie().padAngle(padAngle).sort(null).value((i) => V[i as number])(I) as PieArcDatum<number>[];
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius).cornerRadius(5) as Arc<any, DefaultArcObject>;
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
    
    const imageWidths = calcImageWidths(innerRadius, outerRadius, arcs, V)

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

function calcImageWidths(innerRadius: number, outerRadius: number, arcAngles: PieArcDatum<number>[], values: number[]): number[] {
    const arcWidth = outerRadius - innerRadius
    const [min, max] = d3.extent(values) as [number, number]
    const props = values.map(v => (v - min) / (max - min))  // proportion to min, max

    const initialWidths = props.map(p => arcWidth * ((p * 0.45) + 0.50))
    
    // Now we need to limit the size to the actual pie arc width available.
    // We approximate arc width by multiplying the angle with the radians,
    // and use it as a maximum.
    return initialWidths.map((w, i) => Math.min(w, approximateArcWidth(innerRadius, arcAngles[i])))
}

/**
 * Uses law of cosines to identify the approximate width of the arc by 
 * identifying the distance between the corner midpoints.
 */
function approximateArcWidth(innerRadius: number, angle: PieArcDatum<number>): number {
    const angleRadians = angle.endAngle - angle.startAngle
    
    // c^2 = a^2 + b^2 - 2ab*cos(theta)
    // a = b => c^2 = a^2 + a^2 - 2aa*cos(theta)
    // c^2 = 2a^2 - 2a^2*cos(theta)
    // c^2 = 2a^2 - 2a^2*cos(theta)
    // c^2 = 2a^2(1 - cos(theta))
    // c = sqrt(2a^2(1 - cos(theta)))
    return Math.sqrt(2 * Math.pow(innerRadius, 2) * (1 - Math.cos(angleRadians))) - 4
}

function imageTransform(width: number, [centerX, centerY]: [number, number]): [number, number] {
    return [centerX - (width / 2), centerY - (width / 2)]
}