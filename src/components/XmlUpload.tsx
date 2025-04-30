import React from 'react';
import { XMLParser } from 'fast-xml-parser';
import { CanvasComponent } from '../types/canvasTypes';
import { generateDesignFromUML } from '../utils/generateDesignFromUML';
import { FiUpload } from 'react-icons/fi';

interface XmlUploadProps {
  onImport: (components: CanvasComponent[]) => void;
}

const XmlUpload: React.FC<XmlUploadProps> = ({ onImport }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      try {
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "@_",
        });

        const parsed = parser.parse(text);
        const result = generateDesignFromUML(parsed);
        onImport(result.elements);
        alert(result.title);
      } catch (err) {
        console.error("Error al procesar el XML", err);
        alert("Archivo XML inválido");
      }
    }
  };

  const iconStyle: React.CSSProperties = {
    marginRight: '8px',
    fontSize: '20px',
    color: '#1d4ed8',
  };

  const buttonTextStyle: React.CSSProperties = {
    color: '#1d4ed8',
    fontWeight: '500',
    display: 'inline-block',
  };

  const responsiveTextStyle: React.CSSProperties = {
    display: 'none',
  };

  // Detectar tamaño de pantalla
  const isMobile = window.innerWidth <= 600;

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 12px',
        border: '1px solid #1d4ed8',
        borderRadius: '5px',
        backgroundColor: '#e0f2fe',
        cursor: 'pointer',
        marginTop: '1rem',
      }}
    >
      <FiUpload style={iconStyle} />
      {!isMobile && <span style={buttonTextStyle}>Importar XML (EA)</span>}
      <input type="file" accept=".xml" onChange={handleFileChange} style={{ display: 'none' }} />
    </label>
  );
};

export default XmlUpload;
