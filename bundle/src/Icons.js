import { svg, path } from './Html';

// var/tmp/heroicons
const d = {
    arrowRight: "M14 5l7 7m0 0l-7 7m7-7H3",
    arrowLeft: "M10 19l-7-7m0 0l7-7m-7 7h18",
    arrowNarrowLeft: "M7 16l-4-4m0 0l4-4m-4 4h18",
    refresh: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    check: "M5 13l4 4L19 7",
    checkCircle: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
}

export default function Icon(i) {
    return (
        svg({fill: "none", "viewBox": "0 0 24 24", stroke: "currentColor"}, [
            path({"stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: d[i] })
        ])
    );
}
