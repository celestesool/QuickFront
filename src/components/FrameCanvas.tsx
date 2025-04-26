import React from 'react'

interface Props {
  frameName: string
}

const FrameCanvas: React.FC<Props> = ({ frameName }) => {
  return (
    <div style={{
      width: '100%',
      minHeight: '500px',
      border: '1px dashed #999',
      padding: '20px',
      background: '#f9f9f9'
    }}>
      <p>Editor visual para <strong>{frameName}</strong></p>
      <p>Aquí puedes agregar elementos visuales y exportar esta pantalla como componente Angular.</p>
    </div>
  )
}

export default FrameCanvas
