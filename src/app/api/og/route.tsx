import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#0d0d0d',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#7c6af7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            ⚡
          </div>
          <span style={{ fontSize: '20px', color: '#888', letterSpacing: '0.1em' }}>
            CODE REVIEW ASSISTANT
          </span>
        </div>

        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: '#e8e8e8',
            lineHeight: 1.1,
            marginBottom: '24px',
          }}
        >
          AI-powered code review
          <br />
          <span style={{ color: '#7c6af7' }}>in seconds.</span>
        </div>

        <div style={{ fontSize: '24px', color: '#888', lineHeight: 1.5 }}>
          Paste your code → get structured feedback on bugs,
          <br />
          security, performance and code style.
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '48px',
          }}
        >
          {['🐛 Bugs', '⚡ Improvements', '🔒 Security', '🎨 Code Style'].map((label) => (
            <div
              key={label}
              style={{
                padding: '8px 16px',
                border: '1px solid #2e2e2e',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#e8e8e8',
                backgroundColor: '#1a1a1a',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
