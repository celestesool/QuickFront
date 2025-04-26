export type ComponentType = 'button' | 'input' | 'text' | 'image' | 'square' | 'frame';

export interface CanvasComponent {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  content: string;
  styles?: React.CSSProperties;
}