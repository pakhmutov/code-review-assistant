import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#0d0d0d',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: '#7c6af7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              marginRight: '16px',
            }}
          >
            ⚡
          </div>
          <span style={{ fontSize: '18px', color: '#888', letterSpacing: '0.1em' }}>
            CODE REVIEW ASSISTANT
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '60px',
            fontWeight: 700,
            color: '#e8e8e8',
            lineHeight: '1.15',
            marginBottom: '28px',
          }}
        >
          <span>AI-powered code review</span>
          <span style={{ color: '#7c6af7' }}>in seconds.</span>
        </div>

        <div style={{ display: 'flex', fontSize: '22px', color: '#888' }}>
          Paste code — get feedback on bugs, security and style.
        </div>

        <div style={{ display: 'flex', marginTop: '48px' }}>
          <div style={{ display: 'flex', padding: '8px 16px', border: '1px solid #2e2e2e', borderRadius: '8px', fontSize: '16px', color: '#e8e8e8', backgroundColor: '#1a1a1a', marginRight: '10px' }}>
            🐛 Bugs
          </div>
          <div style={{ display: 'flex', padding: '8px 16px', border: '1px solid #2e2e2e', borderRadius: '8px', fontSize: '16px', color: '#e8e8e8', backgroundColor: '#1a1a1a', marginRight: '10px' }}>
            ⚡ Improvements
          </div>
          <div style={{ display: 'flex', padding: '8px 16px', border: '1px solid #2e2e2e', borderRadius: '8px', fontSize: '16px', color: '#e8e8e8', backgroundColor: '#1a1a1a', marginRight: '10px' }}>
            🔒 Security
          </div>
          <div style={{ display: 'flex', padding: '8px 16px', border: '1px solid #2e2e2e', borderRadius: '8px', fontSize: '16px', color: '#e8e8e8', backgroundColor: '#1a1a1a' }}>
            🎨 Code Style
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
