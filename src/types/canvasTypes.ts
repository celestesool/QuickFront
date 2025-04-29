export type ComponentType = 'frame' | 'square' | 'circle' | 'rectangle' | 'button' | 'text' | 'input' | 'image' | 'line';

export interface CanvasComponent {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex: number;
  content?: string;
  styles: {
    backgroundColor?: string;
    backgroundImage?: string; // Para degradados
    color?: string;
    fontSize?: number;
    border?: string;
    borderRadius?: string;
    borderWidth?: number; // Para líneas
    borderColor?: string; // Para líneas
    [key: string]: any;
  };
  // Propiedades específicas para líneas
  lineType?: 'solid' | 'dashed' | 'dotted';
  linePoints?: { x: number; y: number }[]; // Para líneas personalizadas
}