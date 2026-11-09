import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { useSearchParams } from "react-router-dom";

import { useBrowserSnapshot } from "../../../hooks/useBrowserSnapshot";
import type { GraphEdge, GraphNode, IntelligenceGraphProps } from "./types";
import "./graph.css";

export type { GraphEdge, GraphNode, IntelligenceGraphProps } from "./types";

const WIDTH = 1200;
const HEIGHT = 600;
const NODE_WIDTH = 300;
const NODE_HEIGHT = 74;
const ROW_HEIGHT = 108;
const MAX_NODES = 192;
const MAX_EDGES = 512;
const kindOrder: Readonly<Record<GraphNode["kind"], number>> = { module: 0, repository: 1, entity: 2 };
const queryKeys = new Set(["q", "repository", "state", "evidence", "entity", "graph", "view"]);
const preservedKeys = ["q", "repository", "state", "evidence", "view"];

interface Point { readonly x: number; readonly y: number }
interface Camera extends Point { readonly zoom: number }
interface PositionedNode extends GraphNode { readonly position: Point; readonly safeHref: string | null; readonly safeSourceHref: string | null }

const initialCamera: Camera = { x: WIDTH / 2, y: HEIGHT / 2, zoom: 1 };
const compare = (left: string, right: string) => left < right ? -1 : left > right ? 1 : 0;
const boundedText = (value: unknown, maximum: number): value is string =>
  typeof value === "string" && value.length > 0 && value.length <= maximum && !/[\u0000-\u001f\u007f]/.test(value);

/** Internal fleet routes or exact consumer routes admitted by the publication catalog. */
export function safeGraphHref(value: unknown, publicationRoutes: ReadonlySet<string> = new Set()): string | null {
  if (typeof value !== "string" || value.length > 4096 || /[\\\u0000-\u0020\u007f]/.test(value)) return null;
  if (value.startsWith("https://")) {
    try {
      const url = new URL(value);
      if (url.protocol !== "https:" || url.username || url.password || url.port || url.hash || url.href !== value
          || !publicationRoutes.has(`${url.origin}${url.pathname}`)) return null;
      for (const [key, item] of url.searchParams) {
        if (!["q", "state", "kind", "entity", "freshness", "from", "to"].includes(key)
            || item.length > 512 || /[\u0000-\u001f\u007f\\]/.test(item)) return null;
      }
      return url.href;
    } catch { return null; }
  }
  const path = value.split(/[?#]/, 1)[0];
  if (!path || !/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*\/?)?$/.test(path)) return null;
  try {
    const url = new URL(value, "https://egohygiene.io");
    if (url.origin !== "https://egohygiene.io" || url.pathname !== path || url.username || url.password) return null;
    for (const [key, item] of url.searchParams) {
      if (!queryKeys.has(key) || item.length > (key === "graph" ? 1024 : 512) || /[\u0000-\u001f\u007f\\]/.test(item)) return null;
    }
    if (url.hash && !/^[A-Za-z0-9_.:~-]{1,2048}$/.test(decodeURIComponent(url.hash.slice(1)))) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch { return null; }
}

function linkWithContext(href: string | null, context: URLSearchParams, publicationRoutes: ReadonlySet<string>): string | null {
  if (!href) return null;
  // Organization directory filters are not consumer filter state. Explicit
  // consumer entity context is already encoded by the admitted destination.
  if (href.startsWith("https://")) return safeGraphHref(href, publicationRoutes);
  const url = new URL(href, "https://egohygiene.io");
  for (const key of preservedKeys) {
    const value = context.get(key);
    if (value && value.length <= 512 && !/[\u0000-\u001f\u007f\\]/.test(value) && !url.searchParams.has(key)) {
      const next = new URL(url);
      next.searchParams.set(key, value);
      if (safeGraphHref(`${next.pathname}${next.search}${next.hash}`)) url.search = next.search;
    }
  }
  return safeGraphHref(`${url.pathname}${url.search}${url.hash}`);
}

function model(nodes: readonly GraphNode[], edges: readonly GraphEdge[], publicationRoutes: ReadonlySet<string>) {
  const accepted = nodes.filter((node) => boundedText(node.id, 1024) && boundedText(node.label, 512)
    && boundedText(node.state, 128) && typeof node.description === "string" && node.description.length <= 4096
    && ["module", "repository", "entity"].includes(node.kind));
  const counts = new Map<string, number>();
  for (const node of accepted) counts.set(node.id, (counts.get(node.id) ?? 0) + 1);
  const ordered = accepted.filter((node) => counts.get(node.id) === 1).sort((left, right) =>
    kindOrder[left.kind] - kindOrder[right.kind] || compare(left.label, right.label) || compare(left.id, right.id));
  const rows = { module: 0, repository: 0, entity: 0 };
  const placed: PositionedNode[] = ordered.slice(0, MAX_NODES).map((node) => {
    const row = rows[node.kind]++;
    const sourceHref = typeof node.repository === "string" && /^egohygiene\/(?:\.github|[a-z0-9][a-z0-9.-]*)$/.test(node.repository)
      && node.sourceHref === `https://github.com/${node.repository}` ? node.sourceHref : null;
    return { ...node, safeHref: safeGraphHref(node.href, publicationRoutes), safeSourceHref: sourceHref, position: {
      x: 200 + kindOrder[node.kind] * 400,
      y: 106 + row * ROW_HEIGHT,
    } };
  });
  const byId = new Map<string, PositionedNode>(placed.map((node) => [node.id, node]));
  const edgeCounts = new Map<string, number>();
  for (const edge of edges) if (boundedText(edge.id, 1024)) edgeCounts.set(edge.id, (edgeCounts.get(edge.id) ?? 0) + 1);
  const eligibleEdges = edges.filter((edge) => edgeCounts.get(edge.id) === 1
    && byId.has(edge.source) && byId.has(edge.target) && boundedText(edge.label, 512)
    && boundedText(edge.assertion, 128) && boundedText(edge.freshness, 128)
    && ["navigation", "declared"].includes(edge.kind)).sort((left, right) => compare(left.id, right.id));
  const relations = eligibleEdges.slice(0, MAX_EDGES);
  return { nodes: placed, edges: relations, byId,
    bounded: ordered.length > MAX_NODES || eligibleEdges.length > MAX_EDGES,
    canvasHeight: Math.max(HEIGHT, 158 + Math.max(rows.module, rows.repository, rows.entity) * ROW_HEIGHT) };
}

function sourceContext(edge: GraphEdge) {
  return edge.sourceState || edge.sourceFreshness ? ` · Source view: ${edge.sourceState ?? "unknown"} · Source freshness: ${edge.sourceFreshness ?? "unknown"}` : "";
}

function shortLabel(value: string, maximum = 33) {
  const characters = Array.from(value);
  return characters.length <= maximum ? value : `${characters.slice(0, maximum - 1).join("")}…`;
}

function edgePath(source: Point, target: Point) {
  if (source.x === target.x && source.y === target.y) return `M ${source.x + NODE_WIDTH / 2} ${source.y - 10} C ${source.x + NODE_WIDTH / 2 + 64} ${source.y - 92}, ${source.x - NODE_WIDTH / 2 - 64} ${source.y - 92}, ${source.x - NODE_WIDTH / 2} ${source.y - 10}`;
  const direction = target.x >= source.x ? 1 : -1;
  const start = { x: source.x + direction * NODE_WIDTH / 2, y: source.y };
  const end = { x: target.x - direction * NODE_WIDTH / 2, y: target.y };
  if (source.x === target.x) return `M ${source.x + NODE_WIDTH / 2} ${source.y} C ${source.x + NODE_WIDTH / 2 + 72} ${source.y}, ${target.x + NODE_WIDTH / 2 + 72} ${target.y}, ${target.x + NODE_WIDTH / 2} ${target.y}`;
  const bend = Math.max(48, Math.abs(end.x - start.x) / 2);
  return `M ${start.x} ${start.y} C ${start.x + direction * bend} ${start.y}, ${end.x - direction * bend} ${end.y}, ${end.x} ${end.y}`;
}

/** A navigation aid over already-admitted records, with no layout-derived claims. */
export function IntelligenceGraph({ nodes, edges, publicationRoutes }: IntelligenceGraphProps) {
  const ready = useBrowserSnapshot();
  const [browserParams, setSearchParams] = useSearchParams();
  const params = ready ? browserParams : new URLSearchParams();
  const publications = useMemo(() => new Set(publicationRoutes ?? []), [publicationRoutes]);
  const data = useMemo(() => model(nodes, edges, publications), [nodes, edges, publications]);
  const requested = params.get("graph") ?? "";
  const selected = data.byId.get(requested);
  const [camera, setCamera] = useState<Camera>(initialCamera);
  const [neighborsOnly, setNeighborsOnly] = useState(false);
  const drag = useRef<{ pointer: number; clientX: number; clientY: number; scaleX: number; scaleY: number; camera: Camera } | null>(null);
  const instance = useId().replace(/[^A-Za-z0-9_-]/g, "");
  const headingId = `oi-graph-heading-${instance}`;
  const instructionsId = `oi-graph-instructions-${instance}`;
  const markerId = `oi-graph-arrow-${instance}`;
  const connected = data.edges.filter((edge) => edge.source === selected?.id || edge.target === selected?.id);
  const neighborIds = new Set(selected ? [selected.id, ...connected.flatMap((edge) => [edge.source, edge.target])] : []);
  const visibleNodes = neighborsOnly && selected ? data.nodes.filter((node) => neighborIds.has(node.id)) : data.nodes;
  const visibleIds = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = data.edges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target));
  const viewWidth = WIDTH / camera.zoom;
  const viewHeight = HEIGHT / camera.zoom;
  const selectedX = selected?.position.x;
  const selectedY = selected?.position.y;

  useEffect(() => {
    if (ready && selectedX !== undefined && selectedY !== undefined) setCamera((current) =>
      ({ x: selectedX, y: selectedY, zoom: Math.max(0.85, current.zoom) }));
  }, [ready, requested, selectedX, selectedY]);

  function select(id: string) {
    const next = new URLSearchParams(params);
    const node = data.byId.get(id);
    if (node) {
      next.set("graph", id);
      setCamera((current) => ({ x: node.position.x, y: node.position.y, zoom: Math.max(0.85, current.zoom) }));
    } else {
      next.delete("graph");
      setNeighborsOnly(false);
    }
    setSearchParams(next, { replace: true, preventScrollReset: true });
  }

  function updateCamera(next: Camera) {
    setCamera({ x: Math.max(-WIDTH, Math.min(WIDTH * 2, next.x)),
      y: Math.max(-HEIGHT, Math.min(data.canvasHeight + HEIGHT, next.y)),
      zoom: Math.max(0.02, Math.min(4, next.zoom)) });
  }

  function zoom(factor: number) { updateCamera({ ...camera, zoom: camera.zoom * factor }); }
  function pan(x: number, y: number) { updateCamera({ ...camera, x: camera.x + x * viewWidth, y: camera.y + y * viewHeight }); }
  function fit() {
    if (!visibleNodes.length) return;
    const minimumX = Math.min(...visibleNodes.map((node) => node.position.x - NODE_WIDTH / 2)) - 50;
    const maximumX = Math.max(...visibleNodes.map((node) => node.position.x + NODE_WIDTH / 2)) + 50;
    const minimumY = Math.min(...visibleNodes.map((node) => node.position.y - NODE_HEIGHT / 2)) - 60;
    const maximumY = Math.max(...visibleNodes.map((node) => node.position.y + NODE_HEIGHT / 2)) + 60;
    updateCamera({ x: (minimumX + maximumX) / 2, y: (minimumY + maximumY) / 2,
      zoom: Math.min(WIDTH / (maximumX - minimumX), HEIGHT / (maximumY - minimumY), 1.4) });
  }

  function keyboard(event: KeyboardEvent<SVGSVGElement>) {
    if (event.target !== event.currentTarget) return;
    const actions: Record<string, () => void> = { ArrowLeft: () => pan(-0.2, 0), ArrowRight: () => pan(0.2, 0),
      ArrowUp: () => pan(0, -0.2), ArrowDown: () => pan(0, 0.2), "+": () => zoom(1.25), "=": () => zoom(1.25),
      "-": () => zoom(0.8), Home: () => setCamera(initialCamera), f: fit };
    const action = actions[event.key];
    if (action) { event.preventDefault(); action(); }
  }

  function startDrag(event: PointerEvent<SVGSVGElement>) {
    if (!ready || event.button !== 0 || (event.target as Element).closest("[data-graph-node]")) return;
    const transform = event.currentTarget.getScreenCTM();
    if (!transform || !Number.isFinite(transform.a) || !Number.isFinite(transform.d) || !transform.a || !transform.d) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { pointer: event.pointerId, clientX: event.clientX, clientY: event.clientY,
      scaleX: 1 / transform.a, scaleY: 1 / transform.d, camera };
  }

  function moveDrag(event: PointerEvent<SVGSVGElement>) {
    const start = drag.current;
    if (!start || start.pointer !== event.pointerId) return;
    updateCamera({ ...start.camera, x: start.camera.x - (event.clientX - start.clientX) * start.scaleX,
      y: start.camera.y - (event.clientY - start.clientY) * start.scaleY });
  }

  function endDrag(event: PointerEvent<SVGSVGElement>) {
    if (drag.current?.pointer !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  const nodeLink = (node: PositionedNode) => linkWithContext(node.safeHref, params, publications);

  return <section className="oi-graph" aria-labelledby={headingId}>
    <header className="oi-section-heading"><div><p className="site-eyebrow">Connected views</p><h2 id={headingId}>Explore the Intelligence graph</h2></div><p className="oi-muted">Open a destination, or choose a node to inspect its declared connections.</p></header>
    <p className="oi-graph-legend"><span><i data-kind="navigation" aria-hidden="true" />Navigation membership</span><span><i data-kind="declared" aria-hidden="true" />Declared relationship →</span></p>
    <p className="oi-muted">Columns group fleet views, repositories and evidence for navigation. Position and proximity do not establish dependency, causality, completion or approval.</p>
    {!data.nodes.length ? <p className="oi-state-note">No admitted graph destinations are available at this source boundary.</p> : <>
      <div className="oi-graph-controls" role="group" aria-label="Graph controls">
        <label>Inspect a node<select disabled={!ready} value={selected?.id ?? ""} onChange={(event) => select(event.target.value)}><option value="">Choose a destination</option>{data.nodes.map((node) => <option key={node.id} value={node.id}>{node.kind}: {node.label}</option>)}</select></label>
        <label className="oi-graph-toggle"><input disabled={!ready || !selected} type="checkbox" checked={neighborsOnly} onChange={(event) => setNeighborsOnly(event.target.checked)} />Selected connections only</label>
        <div className="oi-graph-buttons"><button disabled={!ready} type="button" onClick={() => zoom(1.25)} aria-label="Zoom in">+</button><button disabled={!ready} type="button" onClick={() => zoom(0.8)} aria-label="Zoom out">−</button><button disabled={!ready} type="button" onClick={fit}>Fit graph</button><button disabled={!ready} type="button" onClick={() => setCamera(initialCamera)}>Reset view</button></div>
        <div className="oi-graph-buttons" role="group" aria-label="Pan graph"><button disabled={!ready} type="button" aria-label="Pan left" onClick={() => pan(-0.2, 0)}>←</button><button disabled={!ready} type="button" aria-label="Pan up" onClick={() => pan(0, -0.2)}>↑</button><button disabled={!ready} type="button" aria-label="Pan down" onClick={() => pan(0, 0.2)}>↓</button><button disabled={!ready} type="button" aria-label="Pan right" onClick={() => pan(0.2, 0)}>→</button></div>
      </div>
      <p className="oi-muted" id={instructionsId}>Graph links open their views. Focus the canvas to pan with arrow keys; + and − zoom, Home resets, and F fits the graph. Drag the background to pan. The complete admitted directory below also works without JavaScript.</p>
      <div className="oi-graph-canvas">
        <svg viewBox={`${camera.x - viewWidth / 2} ${camera.y - viewHeight / 2} ${viewWidth} ${viewHeight}`}
          role="group" aria-label="Intelligence navigation graph" aria-describedby={instructionsId} tabIndex={ready ? 0 : -1}
          onKeyDown={keyboard} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
          <defs><marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>
          <g className="oi-graph-edges" aria-hidden="true">{visibleEdges.map((edge) => {
            const source = data.byId.get(edge.source)!;
            const target = data.byId.get(edge.target)!;
            return <g key={edge.id} data-kind={edge.kind} data-connected={neighborIds.has(edge.source) && neighborIds.has(edge.target)}>
              <title>{`${source.label} → ${target.label}: ${edge.label} · ${edge.kind} · ${edge.assertion} · ${edge.freshness}${sourceContext(edge)}`}</title>
              <path d={edgePath(source.position, target.position)} markerEnd={edge.kind === "declared" ? `url(#${markerId})` : undefined} />
              {edge.kind === "declared" ? <text x={(source.position.x + target.position.x) / 2} y={(source.position.y + target.position.y) / 2 - 8} textAnchor="middle">{shortLabel(edge.label, 22)}</text> : null}
            </g>;
          })}</g>
          <g>{visibleNodes.map((node) => {
            const href = nodeLink(node);
            const content = <><rect x={node.position.x - NODE_WIDTH / 2} y={node.position.y - NODE_HEIGHT / 2} width={NODE_WIDTH} height={NODE_HEIGHT} rx="10" /><text x={node.position.x - NODE_WIDTH / 2 + 15} y={node.position.y - 12} className="oi-graph-node-kind">{node.kind} · {shortLabel(node.state, 24)}</text><text x={node.position.x - NODE_WIDTH / 2 + 15} y={node.position.y + 15} className="oi-graph-node-label">{shortLabel(node.label)}</text><title>{`${node.label} · ${node.kind} · ${node.state}. ${node.description}`}</title></>;
            return <g key={node.id} className="oi-graph-node" data-graph-node data-kind={node.kind} data-selected={node.id === selected?.id}>
              {href ? <a href={href} tabIndex={ready ? 0 : -1} aria-label={`${node.label}, ${node.kind}, ${node.state}. Open view.`} onFocus={() => ready && select(node.id)}>{content}</a> : <g>{content}</g>}
            </g>;
          })}</g>
        </svg>
      </div>
      <p className="oi-graph-status" role="status" aria-live="polite">{visibleNodes.length} admitted nodes and {visibleEdges.length} connections in the current graph view. Zoom {Math.round(camera.zoom * 100)}%.</p>
      {data.bounded ? <p className="oi-state-note">The graph component bounds presentation to {MAX_NODES} unique nodes and {MAX_EDGES} connections. The producer's endpoint views remain the complete evidence entry points.</p> : null}
      <aside className="oi-graph-inspector" aria-labelledby={`oi-graph-inspector-${instance}`}>
        <h3 id={`oi-graph-inspector-${instance}`}>{selected ? selected.label : "Inspect a destination"}</h3>
        {selected ? <><p><b>{selected.kind}</b> · {selected.state}{selected.repository ? ` · ${selected.repository}` : ""}</p><p>{selected.description || "No additional description is projected."}</p>{nodeLink(selected) ? <a href={nodeLink(selected)!}>Open destination →</a> : <p>Publication destination unavailable for this node.</p>}{selected.safeSourceHref ? <p><a href={selected.safeSourceHref}>GitHub source</a></p> : null}
          <h4>Connected records</h4>{connected.length ? <ul>{connected.map((edge) => {
            const source = data.byId.get(edge.source)!;
            const target = data.byId.get(edge.target)!;
            const other = edge.source === selected.id ? target : source;
            return <li key={edge.id}><button type="button" onClick={() => select(other.id)}>{other.label}</button><p>{source.label} → {target.label}: {edge.label}. <b>{edge.kind}</b> · {edge.assertion} · Captured freshness: {edge.freshness}{sourceContext(edge)}</p>{safeGraphHref(edge.evidenceHref, publications) ? <a href={safeGraphHref(edge.evidenceHref, publications)!}>Open declared relationship evidence</a> : null}</li>;
          })}</ul> : <p>No connections are projected for this node; that is not proof of independence.</p>}</> : <p>Choose a node or focus a graph link to see its exact relationships and destination.</p>}
      </aside>
      <div className="oi-graph-directories">
        <section aria-labelledby={`oi-graph-nodes-${instance}`}><h3 id={`oi-graph-nodes-${instance}`}>Node directory</h3><ul>{data.nodes.map((node) => <li key={node.id}><p>{nodeLink(node) ? <a href={nodeLink(node)!}><bdi dir="auto">{node.label}</bdi></a> : <bdi dir="auto">{node.label}</bdi>}</p>{node.safeSourceHref ? <p><a href={node.safeSourceHref}>GitHub source</a></p> : null}<p className="oi-muted">{node.kind} · {node.state}{node.repository ? ` · ${node.repository}` : ""}</p><button disabled={!ready} type="button" onClick={() => select(node.id)}>Inspect connections</button></li>)}</ul></section>
        <section aria-labelledby={`oi-graph-relations-${instance}`}><h3 id={`oi-graph-relations-${instance}`}>Relationship directory</h3>{data.edges.length ? <ul>{data.edges.map((edge) => <li key={edge.id}><p><bdi dir="auto">{data.byId.get(edge.source)!.label}</bdi> → <bdi dir="auto">{data.byId.get(edge.target)!.label}</bdi></p><p>{edge.label} · <b>{edge.kind}</b> · {edge.assertion} · Captured freshness: {edge.freshness}{sourceContext(edge)}</p>{safeGraphHref(edge.evidenceHref, publications) ? <a href={safeGraphHref(edge.evidenceHref, publications)!}>Open declared relationship evidence</a> : null}</li>)}</ul> : <p>No relationship records are admitted. Navigation remains available through the node directory.</p>}</section>
      </div>
    </>}
  </section>;
}
