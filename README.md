# TomatoClock

### tomatoClock.jsx
### Board
統整所有元件，保存 ＆整理 資料

### ClockArea.jsx
#### ClockArea
放置 **Title** & **CountdownClock** & **ClockButtonGroup**
* 更新畫面 
* 連動按鈕跟倒數計時時鐘
* 定時接收外部資訊

#### ClockTitle
設定倒數鐘標題 目前時間 & 目前完成數/尚未完成數
#### CountdownClock
倒數鐘 顯示區域
* 初始倒數時間由外部傳進來
* 由外部設`指令(cmd)`來『啟動』『暫停』『重置』
* 內部設`狀態(status)`來控制細部流程
* 當時間到傳送訊號出去

#### ClockButtonGroup
倒數鐘按鈕群組 取消、啟動/暫停、重設

### FeaturesArea.jsx
#### FeaturesArea
整合功能頁 ＆ 選單 之間的連動
#### MenuList
選單，切換功能更新 功能區
#### PageHome
功能頁，顯示代辦事項 ＆ 以完成事項 ＆ 新增代辦事項
#### PageSubject
功能頁，用日期區分以圖表方式 顯示代辦事項 ＆ 以完成事項 

#### PageSettings
設定鈴聲