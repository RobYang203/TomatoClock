//倒數計時區域
export default class ClockArea extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			refreshCount:0,
			countDown:{
				countDownTime:0,
				isPaused:true,
				StartTime:0,
				PauseTime:0
			}
		};
		this.refreshClockArea = this.refreshClockArea.bind(this);
		this.setCancelBtnClick = this.setCancelBtnClick.bind(this);
		this.setStartBtnClick = this.setStartBtnClick.bind(this);
		this.setResetBtnClick = this.setResetBtnClick.bind(this);
		this.getClockState = this.getClockState.bind(this);
	}

	refreshClockArea(){
		const refreshCount = this.state.refreshCount+1;
		const {StartTime,isPaused}=this.state.countDown;
		if(StartTime > 0 && !isPaused)
			this.countDownCalc();

		const isBreak = this.props.clockType === "break";
		if(isBreak)
			this.setStartBtnClick(false);
		this.setState(
			{
				refreshCount:refreshCount
			}
		);
	}
	//計算倒數時間，假如有暫停，會在開始的時間補上暫停的時間，確認倒數秒數不會變動
	countDownCalc(){
		let {StartTime} = this.state.countDown;
		const {PauseTime} = this.state.countDown; 
		const clockType = this.props.clockType;
		const isBreak = this.props.clockType === "break";
		const totalMin = isBreak?0.5:0.5;
		const totalTime = totalMin*60*1000;
		const isReStart = PauseTime>0;
		const pauseTime = isReStart? Date.now()- PauseTime:0;
		StartTime +=pauseTime ;	

		const remainingTime = Date.now()-StartTime;
		const isStandard = remainingTime >=1000;
		const spendTime = isStandard?remainingTime:0;
		const nowCountDownTime = (totalTime - spendTime)/1000; 
		const isEnd = nowCountDownTime<=0;

		this.state.countDown.StartTime = isEnd?0:StartTime;	
		this.state.countDown.isPaused = isEnd;
		this.state.countDown.countDownTime=nowCountDownTime;
		this.state.countDown.PauseTime = 0;

		const clockState = isEnd? 2 : 1;
		if(isEnd)
			this.props.onClockStateChange(clockState,clockType);
	}

	setStartBtnClick(isPaused){
		//const isStateChange = this.state.countDown.isPaused !== isPaused;
		const {StartTime,PauseTime} = this.state.countDown;
		this.state.countDown.isPaused = isPaused;
		const nowTime = Date.now();
		const isNewStart = !isPaused && StartTime <=0;
		const isProcessing = !isNewStart && !isPaused;
		const clockState = isNewStart || isProcessing? 1 : 3;

		this.state.countDown.StartTime= isNewStart?nowTime:StartTime;
		this.state.countDown.PauseTime = isPaused?nowTime:PauseTime;
		
		this.props.onClockStateChange(clockState);
	}
	getClockState(){
		const {StartTime,PauseTime,isPaused,countDownTime} = this.state.countDown;

		const isNewStart = PauseTime<=0 && StartTime <=0;
		const isProcessing = !isNewStart && !isPaused;

		let clockState =0;
		if(isNewStart){
			clockState = 0;
		}else if(isProcessing){
			clockState = 1;
		}else if(isPaused){
			clockState = countDownTime > 0? 3: 2;
		}
		return clockState;
	}

	setResetBtnClick(){
		alert("Reset");
		this.state.countDown ={
				countDownTime:0,
				isPaused:true,
				StartTime:0,
				PauseTime:0
			};
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
		const done ="5";
		const totalDo="10";

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
					setStartBtnClick = {this.setStartBtnClick}
					setCancelBtnClick = {this.setCancelBtnClick}
					setResetBtnClick = {this.setResetBtnClick}
					getClockState = {this.getClockState}
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
		const minutes = !isEnd?parseInt(countDownTime/60):25;
		const seconds =  !isEnd?parseInt(countDownTime%60):0;
		const minutesString = this.stringFormat(minutes);
		const secondsString = this.stringFormat(seconds);
		const isWork = this.props.clockType === "work";
		const clockTypeString = isWork?"Work":"Break";
		const clockBody = isWork?"clockBody":"clockBody break"
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
		
		const nowIcon = this.state.startBtnIcon;
		const clockState = this.props.getClockState();
		const isProcessing = clockState === 1;
		const changeIcon = isProcessing?"icon-playback-play":"icon-playback-pause";
		this.setState({
			startBtnIcon:changeIcon
		});
		this.props.setStartBtnClick(isProcessing);
	}
	getInitStartBtnIcon(){
		const clockState = this.props.getClockState();
		const isProcessing = clockState === 1;
		const changeIcon = !isProcessing?"icon-playback-play":"icon-playback-pause";
		return changeIcon;
	}
	render() {
		const {setCancelBtnClick , setResetBtnClick} = this.props;
		const startBtnIcon = `icon ${this.getInitStartBtnIcon()}`;

		return (
			<div className="clkButtonGroup">
				<div className="clkBtn cancelBtn" onClick={setCancelBtnClick}>
					<div className="icon icon-times"></div>
				</div>
				<div className="clkBtn startBtn" onClick={this.changeStartBtnState}>
					<div className={startBtnIcon}></div>
				</div>
				<div className="clkBtn retsetBtn" onClick={setResetBtnClick}>
					<div className="icon icon-cw"></div>
				</div>				
			</div>
		);
	}
}