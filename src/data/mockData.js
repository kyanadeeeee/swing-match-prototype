// ダミーデータ：クラブとシャフトの情報
export const clubManufacturers = [
  {
    id: 1,
    name: "Titleist",
    models: [
      { id: 101, name: "TSR3 Driver", type: "driver", price: 3500, rentalPrice: 350 },
      { id: 102, name: "T300 Iron Set", type: "iron", price: 4200, rentalPrice: 420 },
      { id: 103, name: "Vokey SM9 Wedge", type: "wedge", price: 1800, rentalPrice: 180 }
    ]
  },
  {
    id: 2,
    name: "TaylorMade",
    models: [
      { id: 201, name: "Stealth 2 Driver", type: "driver", price: 3800, rentalPrice: 380 },
      { id: 202, name: "P770 Iron Set", type: "iron", price: 4500, rentalPrice: 450 },
      { id: 203, name: "MG4 Wedge", type: "wedge", price: 1600, rentalPrice: 160 }
    ]
  },
  {
    id: 3,
    name: "Callaway",
    models: [
      { id: 301, name: "Paradym Driver", type: "driver", price: 3600, rentalPrice: 360 },
      { id: 302, name: "Apex Pro Iron Set", type: "iron", price: 4000, rentalPrice: 400 },
      { id: 303, name: "Jaws Raw Wedge", type: "wedge", price: 1700, rentalPrice: 170 }
    ]
  }
];

export const shaftOptions = [
  { id: 1, name: "Project X", flex: "R", weight: "95g", kickPoint: "mid" },
  { id: 2, name: "Project X", flex: "S", weight: "105g", kickPoint: "mid" },
  { id: 3, name: "Project X", flex: "X", weight: "115g", kickPoint: "mid" },
  { id: 4, name: "KBS Tour", flex: "R", weight: "120g", kickPoint: "low" },
  { id: 5, name: "KBS Tour", flex: "S", weight: "130g", kickPoint: "low" },
  { id: 6, name: "KBS Tour", flex: "X", weight: "135g", kickPoint: "low" },
  { id: 7, name: "Graphite Design", flex: "R", weight: "60g", kickPoint: "high" },
  { id: 8, name: "Graphite Design", flex: "S", weight: "65g", kickPoint: "high" },
  { id: 9, name: "Graphite Design", flex: "X", weight: "70g", kickPoint: "high" }
];

// ダミーの分析履歴データ
export const analysisHistory = [
  {
    id: 1,
    date: "2024-01-15",
    headSpeed: 42.5,
    tempo: "ミディアム",
    swingPath: "ややアウトサイドイン",
    recommendedClub: "Titleist TSR3 Driver",
    recommendedShaft: "Project X S-Flex"
  },
  {
    id: 2,
    date: "2024-01-10",
    headSpeed: 44.2,
    tempo: "ファスト",
    swingPath: "スクエア",
    recommendedClub: "TaylorMade Stealth 2 Driver",
    recommendedShaft: "KBS Tour S-Flex"
  },
  {
    id: 3,
    date: "2024-01-05",
    headSpeed: 41.8,
    tempo: "スロー",
    swingPath: "ややインサイドアウト",
    recommendedClub: "Callaway Paradym Driver",
    recommendedShaft: "Graphite Design R-Flex"
  }
];