// モックAPIサービス
import { clubManufacturers, shaftOptions, analysisHistory } from '../data/mockData';

// AI分析のモック関数
export const analyzeSwing = async (videoData) => {
  // 実際のAPI呼び出しをシミュレートするため、遅延を追加
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // ランダムな分析結果を生成
  const headSpeed = (Math.random() * 10 + 35).toFixed(1); // 35-45 m/s
  const tempos = ["スロー", "ミディアム", "ファスト"];
  const swingPaths = ["スクエア", "ややアウトサイドイン", "ややインサイドアウト", "アウトサイドイン", "インサイドアウト"];
  
  const tempo = tempos[Math.floor(Math.random() * tempos.length)];
  const swingPath = swingPaths[Math.floor(Math.random() * swingPaths.length)];
  
  // ヘッドスピードに基づいたクラブとシャフトの推奨
  const recommendedClub = clubManufacturers[Math.floor(Math.random() * clubManufacturers.length)];
  const club = recommendedClub.models.find(model => model.type === "driver");
  
  let recommendedShaft;
  if (headSpeed < 38) {
    recommendedShaft = shaftOptions.find(shaft => shaft.flex === "R");
  } else if (headSpeed < 43) {
    recommendedShaft = shaftOptions.find(shaft => shaft.flex === "S");
  } else {
    recommendedShaft = shaftOptions.find(shaft => shaft.flex === "X");
  }
  
  return {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    headSpeed: parseFloat(headSpeed),
    tempo,
    swingPath,
    clubheadPath: generateRandomPath(),
    timing: {
      backswing: (Math.random() * 0.3 + 0.8).toFixed(2), // 0.8-1.1秒
      downswing: (Math.random() * 0.1 + 0.25).toFixed(2), // 0.25-0.35秒
      impact: (Math.random() * 0.02 + 0.01).toFixed(3) // 0.01-0.03秒
    },
    recommendedClub: `${recommendedClub.name} ${club.name}`,
    recommendedShaft: `${recommendedShaft.name} ${recommendedShaft.flex}-Flex`,
    ballFlight: {
      distance: Math.floor(Math.random() * 50 + 200), // 200-250ヤード
      height: Math.floor(Math.random() * 20 + 25), // 25-45m
      sidespin: Math.floor(Math.random() * 1000 - 500) // -500から+500 rpm
    }
  };
};

// ランダムなスイング軌道を生成
const generateRandomPath = () => {
  const points = [];
  for (let i = 0; i <= 100; i += 5) {
    points.push({
      x: i,
      y: Math.sin((i * Math.PI) / 180) * 30 + Math.random() * 10 - 5
    });
  }
  return points;
};

// バーチャル試打のシミュレーション
export const simulateVirtualHit = async (clubId, shaftId, userSwingData) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const club = findClubById(clubId);
  const shaft = shaftOptions.find(s => s.id === shaftId);
  
  // ユーザーのスイングデータとクラブ特性を組み合わせて結果を計算
  const baseDistance = userSwingData.ballFlight?.distance || 220;
  const clubModifier = getClubModifier(club, shaft);
  
  return {
    distance: Math.floor(baseDistance * clubModifier.distance),
    accuracy: Math.floor(80 + clubModifier.accuracy * 20),
    ballSpeed: Math.floor(userSwingData.headSpeed * 1.4 * clubModifier.ballSpeed),
    launchAngle: Math.floor(12 + clubModifier.launchAngle),
    spinRate: Math.floor(2500 + clubModifier.spin),
    trajectory: generateTrajectory(baseDistance * clubModifier.distance)
  };
};

// クラブとシャフトの特性に基づく修正値
const getClubModifier = (club, shaft) => {
  const modifiers = {
    distance: 1,
    accuracy: 0,
    ballSpeed: 1,
    launchAngle: 0,
    spin: 0
  };
  
  // シャフトのフレックスによる影響
  switch (shaft.flex) {
    case "R":
      modifiers.distance = 0.95;
      modifiers.accuracy = 0.1;
      modifiers.launchAngle = 1;
      break;
    case "S":
      modifiers.distance = 1.0;
      modifiers.accuracy = 0.05;
      break;
    case "X":
      modifiers.distance = 1.05;
      modifiers.accuracy = -0.05;
      modifiers.launchAngle = -1;
      break;
  }
  
  return modifiers;
};

// 弾道軌跡を生成
const generateTrajectory = (distance) => {
  const points = [];
  const maxHeight = 45;
  const steps = 50;
  
  for (let i = 0; i <= steps; i++) {
    const x = (distance * i) / steps;
    const progress = i / steps;
    const y = maxHeight * Math.sin(progress * Math.PI) * (1 - progress * 0.1);
    points.push({ x, y });
  }
  
  return points;
};

// ID でクラブを検索
const findClubById = (clubId) => {
  for (const manufacturer of clubManufacturers) {
    const club = manufacturer.models.find(model => model.id === clubId);
    if (club) return club;
  }
  return null;
};

// 分析履歴を取得
export const getAnalysisHistory = () => {
  return Promise.resolve(analysisHistory);
};

// クラブ一覧を取得
export const getClubs = () => {
  return Promise.resolve(clubManufacturers);
};

// シャフト一覧を取得
export const getShafts = () => {
  return Promise.resolve(shaftOptions);
};