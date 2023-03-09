# Train-Schedule

鐵路時刻表
僅有測試 iPhone 版
Andorid 未測試

## 開發目的

能有一個立刻就能快速載入通勤或指定路線的火車時刻表，而訪間大多數 app 都需要多次點擊

市場上多數列車時刻查詢 APP 需要多次點擊才會顯示想要的資訊，Train-Schedule 提供快速載入通勤或指定路線的火車時刻表，節省使用者操作時間，圖形化介面也讓使用者可以更直覺操作。

## 使用技術

1. 主要框架: React Native 0.70 https://reactnative.dev/
2. 開發工具: Expo https://expo.dev/
3. UI: Native Base https://nativebase.io/
4. 全局變數管理: Recoil.js https://recoiljs.org/

## 功能介紹 &實際畫面

- 主畫面

  - 快速查詢站到站列車時刻表
  - 設定出發時間為現在
  - 設定為查詢抵達時間
  - 儲存快速行程，點擊可立刻載入每日時間、立即和抵達狀態

  <img src="https://github.com/clspeter/Train-Schedule/blob/master/Readme/IMG_2499.PNG" width="33%" height="50%">

  - 選擇時間

  <img src="https://github.com/clspeter/Train-Schedule/blob/master/Readme/IMG_2504.PNG" width="33%" height="50%">

  - 選擇車站

  <img src="https://github.com/clspeter/Train-Schedule/blob/master/Readme/IMG_2506.PNG" width="33%" height="50%">

- 時刻表

  - 即時誤點資料，且每分鐘自動更新，有更新提示小彈窗

  <img src="https://github.com/clspeter/Train-Schedule/blob/master/Readme/IMG_2505.PNG" width="33%" height="50%">

  - 點擊列車進入該車次詳細資料

    - 各站到離站時刻
    - 即時誤點資料、列車目前位置
    - 自動滾動到起訖站區間

    <img src="https://github.com/clspeter/Train-Schedule/blob/master/Readme/IMG_2503.PNG" width="33%" height="50%">

- 其他功能

  - 設定內可選擇開啟 App 時自動選取最近火車站為出發站

  <img src="https://github.com/clspeter/Train-Schedule/blob/master/Readme/IMG_2502.PNG" width="33%" height="50%">

## 如何使用

```sh
yarn install

yarn start
```
