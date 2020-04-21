//倒數計時區域
export default class ClockArea extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			refreshCount:0
        };
        //start , pause , reset
        this.cmd = "stop";
		this.countDownSetting = this.getCountDownSetting(props.clockType);
	}
	//接收啟動按鈕狀態並設定倒數中狀態 暫停、啟動
	setChangeClockState = (isProcessing)=>{
	    this.cmd = isProcessing?'pasued':'start';
		this.props.onClockStateChange(this.cmd,this.props.clockType);
    }
    setCountDownEnd = ()=>{
        this.props.onClockStateChange("end", this.props.clockType);
        this.cmd = "reset";
    };
    getCountDownSetting = (clockType)=>{
        let ret = {};
        ret.type = clockType;
        if(clockType === "work"){
            ret.min = 25;
            ret.sec = 0;           
        }else{
            ret.min = 5;
            ret.sec = 0;
        }
        return ret;
    }
    refreshClockArea = ()=>{
        const refreshCount = this.state.refreshCount+1;
        this.countDownSetting = this.getCountDownSetting(this.props.clockType);
        
        this.setState(
			{
				refreshCount:refreshCount
			}
		);
    };

	render(){
        //設定每0.5s 去重新整理 clock區域畫面
        setTimeout(this.refreshClockArea,500);
        
		return(
			<div className="clockArea">
                <ClockTitle 
					done={this.props.done}
					totalDo={this.props.todo}
				/>
                <div className="clockBorder">
                    <CountdownClock
                        countDownTime={this.countDownSetting}
                        cmd={this.cmd}
                        setCountDownEnd={this.setCountDownEnd}
                    />
                </div>
				
				<ClockButtonGroup
					countDownCmd = {this.cmd}
					setChangeClockState = {this.setChangeClockState}
					setCancelBtnClick = {this.setCancelBtnClick}
					setResetBtnClick = {this.setResetBtnClick}
				/>
			</div>
			) ;
	}
}
//設定倒數鐘標題 目前時間 & 目前完成數/尚未完成數
class ClockTitle extends React.Component{
	constructor(props){
        super(props);
        
        this.state = {
            date : "",
            time : "",
            done : 0,
            totalDo : 0
        };
    }
    
    static getDerivedStateFromProps(nextProps , preState){
        const nowDate = new Date();
		const date=  `${nowDate.getFullYear()}/${nowDate.getMonth()+1}/${nowDate.getDate()}`;
		const time=  `${nowDate.getHours()}:${nowDate.getMinutes()}`;

        preState.date = date;
        preState.time = time;
        preState.done = nextProps.done;
        preState.totalDo = nextProps.totalDo;
        return preState;
    }

	render() {
		const {date,time,done,totalDo} = this.state;
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

//倒數鐘 顯示區域
class CountdownClock extends React.Component{
	constructor(props){
        super(props);
    
        /*
        {
            startMS : 0 ,  
            totalPauseMS: 0,          
            clockStatus:"standby , prepare,processing,end"        
        };
        */
        this.countDownSetting = {};
        /*
        {
            pauseMS : 0 ,
            pauseStartMS : 0,
            clockStatus:"standby,processing" 
        };
        */
        this.pauseSetting = {};

        this.settingTime =  {}; 
        this.clockType ={};

        this.resetCountDown();

        this.state = {
            outerCmd: props.cmd,
            totalMS:0
        };
        
    }
    countDownSettingFormat = ()=>{
        return {
            startMS : 0 ,  
            totalPauseMS: 0,          
            clockStatus:"standby"        
        };
    };
    pauseSettingFormat = ()=>{
        return {
            pauseMS : 0 ,
            pauseStartMS : 0,
            clockStatus:"standby" 
        };
    };


	stringFormat = (num) =>{
		return num<10?"0"+num.toString():num.toString();
    }

    timeToMsFormat = (countDownTime)=>{
        //設定倒數秒數
        const {min , sec} = countDownTime;
		const minutesString = this.stringFormat(min);
        const secondsString = this.stringFormat(sec);

              
        return {
            min : minutesString,
            sec: secondsString
        };
    };

    msToTimeFormat = (ms)=>{
        const toalSec = ms/1000;
        const min = parseInt(toalSec/60);
        const sec = parseInt(toalSec%60);
        
        const minutesString = this.stringFormat(min);
        const secondsString = this.stringFormat(sec);

        return {
            min : minutesString,
            sec: secondsString
        };
    };

    clockTypeFormat = (type)=>{
        const isWork = type === "work";
        return {
            text : isWork?"Work":"Break",
            class :isWork?"clockBody":"clockBody break"
        };        
    }

    //計算倒數時間，假如有暫停，會在開始的時間補上暫停的時間，確認倒數秒數不會變動
	countDownCalc = ()=>{
		const {startMS,totalPauseMS} = this.countDownSetting;

		//設定倒數秒數
		const {totalMS} = this.state;


		//計算目前剩餘秒數，超過一秒再做計算
		const elapseMS = Date.now()- ( startMS + totalPauseMS );
		const isStandard = elapseMS >500;
        const spendMS = isStandard?elapseMS:0;
        const remainingMS = (totalMS - spendMS);

		return remainingMS <= 0 ? 0 : remainingMS; 

    }

    startCountDown = (status)=>{
        switch(status){
            case "standby":
                this.countDownSetting.startMS = Date.now();   
                this.countDownSetting.clockStatus = "prepare";              
                break;
            case "prepare":
                this.countDownSetting.totalPauseMS += this.pauseSetting.pauseMS; 
                this.countDownSetting.clockStatus = "processing"; 
                break;
            case "processing":
                const ms = this.countDownCalc();
                this.settingTime = this.msToTimeFormat(ms);
                this.countDownSetting.clockStatus = ms === 0? "end":"processing"; 
                break; 
            case "end":
                this.props.setCountDownEnd();
                break; 
        }
    };

    pauseCalc = ()=>{
		const {pauseStartMS} = this.pauseSetting;

		return Date.now()-pauseStartMS; 

    }
    pauseCountDown = (status)=>{
        switch(status){
            case "standby":
                this.pauseSetting.pauseStartMS = Date.now(); 
                this.pauseSetting.clockStatus = "processing";               
                break;
            case "processing":
                const ms = this.pauseCalc();
                this.pauseSetting.pauseMS = ms;               
                break; 
        }
    };

    resetCountDown = ()=>{
        this.countDownSetting = this.countDownSettingFormat();
        this.pauseSetting = this.pauseSettingFormat();
        this.settingTime =  this.timeToMsFormat(this.props.countDownTime); 
        this.clockType = this.clockTypeFormat(this.props.countDownTime.type);
    };

    static getDerivedStateFromProps(nextProps, prevState){
        prevState.totalMS =  nextProps.countDownTime.min * 60 * 1000 + nextProps.countDownTime.sec * 1000;
        prevState.outerCmd = nextProps.cmd;

        return prevState;
    }

	render() {

		return (
			<div className={this.clockType.class}>
				<div className="clockState">
					-Start {this.clockType.text}-
				</div>
				<div className="countDownArea">
					<span>{this.settingTime.min}</span>:<span>{this.settingTime.sec}</span>		

				</div>
			</div>
		);
    }
    
    shouldComponentUpdate(nextProps, nextState){
        switch(nextState.outerCmd){
            case "start":   
                this.pauseSetting.clockStatus = "standby";           
                this.startCountDown(this.countDownSetting.clockStatus);        
                break;
            case "reset":
                this.resetCountDown();
                break;
            case "pasued":
                this.countDownSetting.clockStatus = "prepare";
                this.pauseCountDown(this.pauseSetting.clockStatus);
                break;
        }

        return true;
    }
}
//倒數鐘按鈕群組 取消、啟動/暫停、重設
class ClockButtonGroup extends React.Component{
	constructor(props){
		super(props);
		this.changeStartBtnState = this.changeStartBtnState.bind(this);
		const initIcon = this.getInitStartBtnIcon(props.countDownCmd);
		this.state = {
			startBtnIcon:initIcon
		};
	}

	//設定目前啟動按鈕的 ICON 並回傳狀態
	changeStartBtnState(){
        const {startBtnIcon} = this.state;
        const isProcessing =!(startBtnIcon === "icon-playback-play");

        this.props.setChangeClockState(isProcessing);
	}
	getInitStartBtnIcon(cmd){
		const isProcessing = cmd === 'start';
		const changeIcon = !isProcessing?"icon-playback-play":"icon-playback-pause";
		return changeIcon;
	}
	render() {
		const startBtnIcon = `icon icon-large ${this.state.startBtnIcon}`;

		return (
			<div className="clkButtonGroup">
				<div className="clkBtn cancelBtn" onClick={this.setCancelBtnClick}>
					<div className="icon icon-small icon-times"></div>
				</div>
				<div className="clkBtn startBtn" onClick={this.changeStartBtnState}>
					<div className={startBtnIcon}></div>
				</div>
				<div className="clkBtn retsetBtn" onClick={this.setResetBtnClick}>
					<div className="icon icon-small icon-cw"></div>
				</div>				
			</div>
		);
    }
    
    shouldComponentUpdate(nextProps , nextState){
        nextState.startBtnIcon = this.getInitStartBtnIcon(nextProps.countDownCmd);
        return true;
    }
}