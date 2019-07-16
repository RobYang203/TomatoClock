import React from 'react'
import ClockArea from 'ClockArea.jsx'
import FeaturesArea from 'FeaturesArea.jsx'
export default class tomatoClock extends React.Component{
	constructor(props){
		super(props);
		this.state ={
			list:[
				{
					content:"Test Test Test",
					type:"todo",
					state:0
				},
				{
					content:"Test2 Test2 Test2",
					type:"todo",
					state:0
				},
				{
					content:"Test3 Test3 Test3",
					type:"todo",
					state:0
				},
				{
					content:"Test4 Test4 Test4",
					type:"done",
					state:0
				}
			]
		};
	}
	render(){
		return <Board list={this.state.list}/>;
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
			clockType:"work"
		}
		this.onClockStateChange=this.onClockStateChange.bind(this);
		this.getListCategory=this.getListCategory.bind(this);
		this.featuresListener =this.featuresListener.bind(this);

	}

	onClockStateChange(clockState,clockType){
		this.state.todoList[0]["state"] = clockState;
		if(clockState === 2){
			const stateValue = this.state;
			const newClockType = clockType==="break"?"work":"break";
			this.state.todoList[0]["type"] = clockType==="break"?"todo":"done";
			stateValue.todoList = this.getListCategory("todo");
			stateValue.doneList = this.getListCategory("done");
			
			this.setState(stateValue);
		}
		console.log(this.state.todoList[0]["state"])
	}
	featuresListener(v){
		const stateValue = this.state;
		const tmp = {
					content:v,
					type:"todo",
					state:0
				};
		stateValue["list"] = stateValue["list"] .concat(tmp);
		this.setState(stateValue);

	}
	getListCategory(type){
		const list = this.state.list;
		const ret = list.filter(function(item){
			return item["type"] === type;

		});

		return ret;
	}
	render(){
		this.state.todoList= this.getListCategory("todo");
		this.state.doneList= this.getListCategory("done");
		const doneLength = this.state.doneList.length;
		const todoLength= this.state.todoList.length;

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
					featuresListener={this.featuresListener}
				/>
			</div>
			);
	}
}



