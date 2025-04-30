import { CanvasComponent } from '../types/canvasTypes';

export const generateDesignFromUML = (parsed: any): { title: string; elements: CanvasComponent[] } => {
  const model = parsed?.XMI?.["XMI.content"]?.["UML:Model"];
  const ownedElement = model?.["UML:Namespace.ownedElement"];
  if (!ownedElement) {
    console.warn("⚠️ No se encontró UML:Namespace.ownedElement");
    return { title: "Importado desde UML (sin clases)", elements: [] };
  }

  const elementsArray = Array.isArray(ownedElement) ? ownedElement : [ownedElement];
  const classes: any[] = [];

  elementsArray.forEach((el: any) => {
    const isPackage = el["UML:Package"];
    const classList = isPackage?.["UML:Namespace.ownedElement"]?.["UML:Class"];
    if (classList) {
      const classArray = Array.isArray(classList) ? classList : [classList];
      classes.push(...classArray);
    }

    const directClass = el["UML:Class"];
    if (directClass) {
      const classArray = Array.isArray(directClass) ? directClass : [directClass];
      classes.push(...classArray);
    }
  });

  const finalElements: CanvasComponent[] = [];
  const columnHeights = [100, 100]; // altura inicial por columna

  classes.forEach((cls: any, index: number) => {
    const name = cls["@_name"] || `Clase${index + 1}`;
    if (name.toLowerCase() === "earootclass") return;

    const rawAttrs = cls["UML:Classifier.feature"]?.["UML:Attribute"];
    const attrs = rawAttrs ? (Array.isArray(rawAttrs) ? rawAttrs : [rawAttrs]) : [];

    const frameHeight = 100 + attrs.length * 50;
    const col = index % 2;
    const baseX = 100 + col * 550;
    const baseY = columnHeights[col];
    columnHeights[col] += frameHeight + 60;

    const frameId = `uml-frame-${index}`;
    finalElements.push({
      id: frameId,
      type: 'frame',
      x: baseX,
      y: baseY,
      width: 500,
      height: frameHeight,
      rotation: 0,
      zIndex: 5 + index,
      content: '',
      styles: {
        backgroundColor: '#ffffff',
        border: '1px solid #ccc',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      metadata: {
        source: 'uml',
        className: name,
        attributes: attrs.map((attr: any) => {
          const attrName = attr["@_name"] || "atributo";
          const tagged = attr["UML:ModelElement.taggedValue"]?.["UML:TaggedValue"];
          let type = "any";
          if (Array.isArray(tagged)) {
            const typeTag = tagged.find((t: any) => t["@_tag"] === "type");
            type = typeTag?.["@_value"] || "any";
          } else if (tagged?.["@_tag"] === "type") {
            type = tagged["@_value"] || "any";
          }
          return { name: attrName, type };
        })
      }
    });

    finalElements.push({
      id: `${frameId}-title`,
      type: 'text',
      x: baseX + 16,
      y: baseY + 16,
      width: 300,
      height: 30,
      rotation: 0,
      zIndex: 11,
      content: name,
      styles: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e3a8a',
      }
    });

    attrs.forEach((attr: any, i: number) => {
      const attrName = attr["@_name"] || `atributo${i + 1}`;
      const yOffset = baseY + 60 + i * 50;

      finalElements.push({
        id: `${frameId}-label-${i}`,
        type: 'text',
        x: baseX + 20,
        y: yOffset,
        width: 150,
        height: 30,
        rotation: 0,
        zIndex: 11,
        content: `${attrName}:`,
        styles: {
          fontSize: 14,
          fontWeight: 'normal',
          color: '#333',
        }
      });

      finalElements.push({
        id: `${frameId}-input-${i}`,
        type: 'input',
        x: baseX + 180,
        y: yOffset,
        width: 260,
        height: 30,
        rotation: 0,
        zIndex: 11,
        content: `Ingrese ${attrName}`,
        styles: {
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: '6px',
          fontSize: 14,
        }
      });
    });
  });

  return {
    title: `Se importaron ${classes.length} clases UML como prototipos`,
    elements: finalElements
  };
};