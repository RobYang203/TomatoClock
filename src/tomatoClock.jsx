import React from 'react'
import ClockArea from 'ClockArea.jsx'
import FeaturesArea from 'FeaturesArea.jsx'
export default class tomatoClock extends React.Component{
	constructor(props){
		super(props);
				
	}
	render(){
		return <Board list={this.props.list}/>;
	}
}
//番茄鐘底板
class Board extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			list:this.props.list,
			todoList:null,
			doneList:null,
			clockType:"work",
			isTimeUp:false,
			ringName:"None"
		}
		this.ringList = {
			work:"None",
			break:"None"
		};
		this.onClockStateChange=this.onClockStateChange.bind(this);
		this.getListCategory=this.getListCategory.bind(this);
		this.featuresListener =this.featuresListener.bind(this);
		this.onConfirmClick = this.onConfirmClick.bind(this);
		this.addNewTask = this.addNewTask.bind(this);
		this.setRing = this.setRing.bind(this);

	}

	onClockStateChange(clockState,clockType){
		this.state.todoList[0]["state"] = clockState;
		if(clockState === "end"){
			const stateValue = this.state;
			const newClockType = clockType==="break"?"work":"break";
			this.state.todoList[0]["type"] = clockType==="break"?"todo":"done";
			stateValue.todoList = this.getListCategory("todo");
			stateValue.doneList = this.getListCategory("done");
			stateValue.clockType = newClockType;
			stateValue.isTimeUp = true;
			stateValue.ringName = clockType==="break"?this.ringList.break:this.ringList.work;
			this.setState(stateValue);
		}
		console.log(this.state.todoList[0]["state"])
	}
	featuresListener(type , v){
		switch(type){
			case "home":
				this.addNewTask(v);
				break;
			case "setting":
				this.setRing(v);
				break;

		}
		

	}
	addNewTask(v){
		const stateValue = this.state;
		const nowDate = new Date();
		const saveDate = `${nowDate.getFullYear()}/${nowDate.getMonth()+1}/${nowDate.getDate()}`; 
		const tmp = {
					content:v,
					type:"todo",
					state:"standby",
					date:saveDate
				};
		stateValue["list"] = stateValue["list"] .concat(tmp);
		this.setState(stateValue);
	}
	setRing(v){
		this.ringList =v;
		console.log(v)
	}
	getListCategory(type){
		const list = this.state.list;
		const ret = list.filter(function(item){
			return item["type"] === type;

		});

		return ret;
	}
	onConfirmClick(){
		this.setState({
			isTimeUp:false
		});
	}
	render(){
		this.state.todoList= this.getListCategory("todo");
		this.state.doneList= this.getListCategory("done");
		const doneLength = this.state.doneList.length;
		const todoLength= this.state.todoList.length;
		const {isTimeUp , ringName} = this.state;
		const openWin = isTimeUp?<TimeUpWindow onConfirmClick={this.onConfirmClick}/>:"";
		const maskClass = isTimeUp?"winMask":"";
		const nowRingName = isTimeUp?ringName:null;
		return (
			
			<div className="t-bgColor">								
				<ClockArea
					done={doneLength}
					todo={todoLength}
					clockType={this.state.clockType}
					onClockStateChange={this.onClockStateChange}
				/>
				<FeaturesArea
					todoList={this.state.todoList}
					doneList={this.state.doneList}
					ringList={this.ringList}
					featuresListener={this.featuresListener}
				/>
				{openWin}
				<div className={maskClass}></div>
				<TimeUpRing
					ringName = {nowRingName}
				/>
			</div>
			);
	}
}
function TimeUpRing(props){
	const {ringName} = props;
	const ringSrc = ringName === null?"":`./css/audio/${ringName}.mp3`
	return(
		<iframe src={ringSrc} allow="autoplay" style={{display:"none"}}></iframe>
		);
}
function TimeUpWindow(props){
	return(
		<div className="win winTimeUp">
			<div className="winTitle">Notification</div>
			<div className="content">
				<div className="title">
					Time's up!
				</div>
			</div>
			<div className="footer">
				<div className="btn btnSend" onClick={props.onConfirmClick} >OK</div>
			</div>
		</div>
		);
}

