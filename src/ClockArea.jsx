//倒數計時區域
export default class ClockArea extends React.Component{
	constructor(props){
		super(props);
		//clockState : standby、reset、processing、end、pasued
		this.state = {
			refreshCount:0,
			countDown:{
				countDownTime:0,
				clockState:'standby',
				startTime:0,
				pauseTime:0
			}
		};
		this.refreshClockArea = this.refreshClockArea.bind(this);
		this.setCancelBtnClick = this.setCancelBtnClick.bind(this);
		this.setChangeClockState = this.setChangeClockState.bind(this);
		this.setResetBtnClick = this.setResetBtnClick.bind(this);
	}

	refreshClockArea(){
		const refreshCount = this.state.refreshCount+1;
		const countDown=this.state.countDown;
		if(countDown.clockState === "processing")
			this.countDownCalc();

		this.setState(
			{
				refreshCount:refreshCount
			}
		);
	}
	//計算倒數時間，假如有暫停，會在開始的時間補上暫停的時間，確認倒數秒數不會變動
	countDownCalc(){
		let {startTime} = this.state.countDown;
		const {pauseTime} = this.state.countDown; 

		//判斷目前倒數類型是 "工作中" 還是 "休息"
		const clockType = this.props.clockType;
		const isBreak = clockType === "break";
		
		//設定倒數秒數
		const workTime = 0.5 , breakTime = 0.5;
		const totalMin = isBreak?workTime:breakTime;

		//轉成 ms
		const totalTime = totalMin*60*1000;

		//判斷目前是否在暫停之後的重新啟用
		const isReStart = pauseTime>0;
		//暫停，會在開始的時間補上暫停的時間，確認倒數秒數不會變動
		const pauseRemainingTime = isReStart? Date.now()- pauseTime:0;
		startTime +=pauseRemainingTime ;	

		//計算目前剩餘秒數，超過一秒再做計算
		const remainingTime = Date.now()-startTime;
		const isStandard = remainingTime >500;
		const spendTime = isStandard?remainingTime:0;
		const nowCountDownTime = (totalTime - spendTime)/1000; 
		const isEnd = nowCountDownTime<=0;

		this.state.countDown.startTime = isEnd? 0 : startTime;	
		this.state.countDown.clockState = isEnd?"standby":this.state.countDown.clockState;
		this.state.countDown.countDownTime = nowCountDownTime;
		this.state.countDown.pauseTime = 0;
		console.log(nowCountDownTime)
		if(isEnd)
			this.props.onClockStateChange("end",clockType);
	}

	setChangeClockState(isProcessing){
		const nowTime = Date.now();
			
		const countDown = this.state.countDown;
		countDown.clockState = isProcessing?'pasued':'processing';
		switch(countDown.clockState){
			case "processing":
				const isNewStart = countDown.startTime <=0;
				countDown.startTime= isNewStart? nowTime: countDown.startTime;
				break;
			case "pasued":
				countDown.pauseTime = nowTime;
				break;
		}

		
		this.props.onClockStateChange(countDown.clockState,this.props.clockType);
	}

	setResetBtnClick(){
		alert("Reset");
		this.state = {
			refreshCount:0,
			countDown:{
				countDownTime:0,
				clockState:'standby',
				startTime:0,
				pauseTime:0
			}
		};
		this.props.onClockStateChange("standby",this.props.clockType);
	}
	setCancelBtnClick(){
		alert("Cancel");
	}

	render(){

		//設定每0.5s 去重新整理 clock區域畫面
		setTimeout(this.refreshClockArea,500);

		const nowDate = new Date();
		const date=  `${nowDate.getFullYear()}/${nowDate.getMonth()+1}/${nowDate.getDate()}`;
		const time=  `${nowDate.getHours()}:${nowDate.getMinutes()}`;

		return(
			<div className="clockArea">
				<ClockTitle 
					date={date}
					time={time}
					done={this.props.done}
					totalDo={this.props.todo}
				/>
				<CountdownClock
					clockType={this.props.clockType}
					countDownTime={this.state.countDown.countDownTime}
				/>
				<ClockButtonGroup
					clockState = {this.state.countDown.clockState}
					setChangeClockState = {this.setChangeClockState}
					setCancelBtnClick = {this.setCancelBtnClick}
					setResetBtnClick = {this.setResetBtnClick}
				/>
			</div>

			) ;
	}
}
class ClockTitle extends React.Component{
	constructor(props){
		super(props);
	}
	render() {
		const {date,time,done,totalDo} = this.props;
		return (
			<div className="titleGroup">
				<div className="nowDateTime">
					<div className="date title">
						{date}
					</div>
					<div className="time content">
						{time}
					</div>
				</div>
				<div className="nowDone">
					<div className="title">
						Done/To do
					</div>
					<div className="content">
						<span >{done}</span>/<span>{totalDo}</span>
					</div>
				</div>
			</div>
		);
	}
}

class CountdownClock extends React.Component{
	constructor(props){
		super(props);
		this.stringFormat = this.stringFormat.bind(this);
	}
	stringFormat(num){
		return num<10?"0"+num.toString():num.toString();
	}
	render() {
		const {countDownTime} = this.props;
		const isEnd = countDownTime<=0;
		const isWork = this.props.clockType === "work";
		const clockTypeString = isWork?"Work":"Break";
		const clockBody = isWork?"clockBody":"clockBody break"
		const startMinutes = isWork?25:5;
		const minutes = !isEnd?parseInt(countDownTime/60):startMinutes;
		const seconds =  !isEnd?parseInt(countDownTime%60):0;
		const minutesString = this.stringFormat(minutes);
		const secondsString = this.stringFormat(seconds);

		return (
			<div className={clockBody}>
				<div className="clockState">
					-Start {clockTypeString}-
				</div>
				<div className="countDownArea">
					<span>{minutesString}</span>:<span>{secondsString}</span>		

				</div>
			</div>
		);
	}
}

class ClockButtonGroup extends React.Component{
	constructor(props){
		super(props);
		this.changeStartBtnState = this.changeStartBtnState.bind(this);
		const initIcon = this.getInitStartBtnIcon();
		this.state = {
			startBtnIcon:initIcon
		};
	}
	changeStartBtnState(){
		
		const clockState = this.props.clockState;
		const isProcessing = clockState === 'processing';
		const changeIcon = isProcessing?"icon-playback-play":"icon-playback-pause";
		this.setState({
			startBtnIcon:changeIcon
		});
		this.props.setChangeClockState(isProcessing);
	}
	getInitStartBtnIcon(){
		const clockState = this.props.clockState;
		const isProcessing = clockState === 'processing';
		const changeIcon = !isProcessing?"icon-playback-play":"icon-playback-pause";
		return changeIcon;
	}
	render() {
		const {setCancelBtnClick , setResetBtnClick} = this.props;
		const startBtnIcon = `icon ${this.getInitStartBtnIcon()}`;

		return (
			<div className="clkButtonGroup">
				<div className="clkBtn cancelBtn" onClick={this.setCancelBtnClick}>
					<div className="icon icon-times"></div>
				</div>
				<div className="clkBtn startBtn" onClick={this.changeStartBtnState}>
					<div className={startBtnIcon}></div>
				</div>
				<div className="clkBtn retsetBtn" onClick={this.setResetBtnClick}>
					<div className="icon icon-cw"></div>
				</div>				
			</div>
		);
	}
}