# TomatoClock
TomatoClock for ToDo List

### ClockArea.jsx
#### ClockArea
設定setTimeOut更新時間
#### ClockTitle
設定倒數鐘標題 目前時間 & 目前完成數/尚未完成數
#### CountdownClock
倒數鐘 顯示區域
* 有 standby、reset、processing、end、pasued狀態
* 初始倒數時間由外部傳進來
* 由外部設`指令`來『啟動』『暫停』『重置』
* 內部設`狀態`來控制細部流程
* 當時間到傳送訊號出去

#### ClockButtonGroup
倒數鐘按鈕群組 取消、啟動/暫停、重設