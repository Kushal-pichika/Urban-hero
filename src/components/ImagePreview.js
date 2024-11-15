import React from 'react';

function ImagePreview({ image }) {
  return (
    <div>
      <h3>Image Preview</h3>
      <img 
        src={image} 
        alt="Waste preview" 
        style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} 
      />
    </div>
  );
}

export default ImagePreview;
