declare module 'colorjs.io' {
  interface Color {
    hsl: [number, number, number];
    luminance: number;
    deltaE(color: Color, options?: { method: string }): number;
  }

  function Color(color: string): Color;

  export default Color;
}