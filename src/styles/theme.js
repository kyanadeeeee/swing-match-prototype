// テーマ設定 - ゴルフコースを連想させる緑色基調
export const theme = {
  colors: {
    primary: '#2E7D32', // ダークグリーン
    primaryLight: '#4CAF50', // メイングリーン
    primaryDark: '#1B5E20', // より深いグリーン
    secondary: '#81C784', // ライトグリーン
    accent: '#A5D6A7', // 非常に薄いグリーン
    background: '#F1F8E9', // 極薄いグリーンの背景
    surface: '#FFFFFF',
    text: {
      primary: '#1B5E20',
      secondary: '#2E7D32',
      light: '#81C784'
    },
    status: {
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      info: '#2196F3'
    },
    gradient: {
      primary: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
      secondary: 'linear-gradient(135deg, #81C784 0%, #A5D6A7 100%)',
      background: 'linear-gradient(180deg, #F1F8E9 0%, #E8F5E8 100%)'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '50%'
  },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.15)',
    lg: '0 8px 16px rgba(0,0,0,0.2)',
    xl: '0 16px 32px rgba(0,0,0,0.25)'
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
      xxxl: '32px'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out'
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px'
  }
};