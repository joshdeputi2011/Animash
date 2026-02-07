import { useState } from 'react';
import { Character } from '../lib/supabase';

interface CharacterCardProps {
  character: Character;
  onClick: () => void;
  disabled?: boolean;
}

export function CharacterCard({ character, onClick, disabled }: CharacterCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
        aspectRatio: '3/4',
        borderRadius: 'var(--animash-card-radius)',
        overflow: 'hidden',
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        background: 'var(--animash-surface)',
        transition: 'all var(--animash-transition)',
        transform: isHovered && !disabled ? 'scale(1.04)' : 'scale(1)',
        boxShadow: isHovered && !disabled 
          ? 'var(--animash-shadow-card-hover)' 
          : 'var(--animash-shadow-card)',
      }}
    >
      {/* Character Image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}>
        <img
          src={character.image_url}
          alt={character.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--animash-transition), filter var(--animash-transition)',
            transform: isHovered && !disabled ? 'scale(1.05)' : 'scale(1)',
            filter: isHovered && !disabled ? 'brightness(1.1)' : 'brightness(1)',
          }}
        />
        
        {/* Dark Gradient Overlay for Text Readability */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent)',
        }} />
      </div>

      {/* Character Info */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '32px 24px',
        zIndex: 10,
      }}>
        <h2 style={{
          fontSize: 'var(--animash-text-character)',
          fontWeight: 600,
          color: 'var(--animash-text)',
          marginBottom: '4px',
          textAlign: 'left',
        }}>
          {character.name}
        </h2>
        <p style={{
          fontSize: 'var(--animash-text-sm)',
          color: 'var(--animash-text-muted)',
          textAlign: 'left',
        }}>
          {character.universe}
        </p>
      </div>

      {/* Red Glow Effect on Hover */}
      {isHovered && !disabled && (
        <div style={{
          position: 'absolute',
          inset: -2,
          borderRadius: 'var(--animash-card-radius)',
          background: 'linear-gradient(135deg, var(--animash-red), var(--animash-red-highlight))',
          opacity: 0.3,
          zIndex: -1,
          filter: 'blur(20px)',
        }} />
      )}
    </button>
  );
}
