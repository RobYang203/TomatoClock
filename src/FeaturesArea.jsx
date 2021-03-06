import {Bar} from "react-chartjs-2"
//功能設定區 選單/功能
export default class FeaturesArea extends React.Component{
	constructor(props){
		super(props);	
		this.state ={
			nowActivePage:"home"
		}
		this.getActivePage = this.getActivePage.bind(this);
		this.setPageChange =this.setPageChange.bind(this);
	}
	//取得並設定指定選單頁
	setPageChange(menu){
		this.setState({
			nowActivePage:menu
		});
	}
	
	//取得目前要顯示哪一頁
	getActivePage(pageName){
		let ret = "";
		switch(pageName){
			case "home":
			ret = <PageHome
					todoList={this.props.todoList}
					doneList={this.props.doneList}
					featuresListener={this.props.featuresListener}
				/>;
			break;
			case "subject":
			ret = <PageSubject/>;
			break;
			case "free_breakfast":
			ret = <PageFree_breakfast/>;
			break;
			case "insert_chart":
			ret = <PageInsert_chart
					todoList={this.props.todoList}
					doneList={this.props.doneList}
					featuresListener={this.props.featuresListener}
					/>;
			break;
			case "settings":
			ret = <PageSettings
					ringList={this.props.ringList}
					featuresListener={this.props.featuresListener}
					/>;
			break;
		}
		return ret;
	}
	render(){
		const nowActiveFeature = this.getActivePage(this.state.nowActivePage);
		return (
			<>
				<div className="featureContent">
					{nowActiveFeature}
				</div>
				<MenuList
					nowActivePage = {this.state.nowActivePage}
					setPageChange = {this.setPageChange}
				/>
			</>
			);
	}
}

//Home Page
class PageHome extends React.Component{
	constructor(props){
		super(props);
		this.getListItem =this.getListItem.bind(this);
		this.onAddTaskClick = this.onAddTaskClick.bind(this);
		this.onCancelWinClick = this.onCancelWinClick.bind(this);
		this.onContentChange = this.onContentChange.bind(this);
		this.onSendClick =this.onSendClick.bind(this);
		this.state = {
			addWinCls:"windAddNewTask hidden",
			txtValue:""
		};
	}

	//按下新增任務事件
	onAddTaskClick(e){
		this.setState({
			addWinCls:"windAddNewTask win"
		});
	}
	//新增任務畫面按鈕取消的事件
	onCancelWinClick(){
		this.setState({
			addWinCls:"windAddNewTask win hidden",
			txtValue:""
		});
	}
	//新增任務畫面按鈕送出的事件
	onSendClick(){

		this.props.featuresListener("home",this.state.txtValue);
		this.setState({
			addWinCls:"windAddNewTask win hidden",
			txtValue:""
		});
	}
	//新增任務畫面 input 輸入的值
	onContentChange(e){
		const stateValue = this.state;
		const txtValue = e.target.value;
		stateValue.txtValue = txtValue;
		this.setState(stateValue);
	}
	//取得 ToDo or Done List 的實作
	getListItem(list){
		if(list === null || list.length === 0)
			return "";
		let retList =[];
		list.map(function(item,i){
			 const tmp =<ListItem
							count={i+1}
							type={item.type}
							content={item.content}
						/>;
			retList =retList.concat(tmp);
		});
		return retList;
	}


	render(){
		const {todoList,doneList}=this.props;
		const todoListGroup = this.getListItem(todoList);
		const doneListGroup = this.getListItem(doneList);
		return (
			<div className="Page">
				<div className="toolbar">
					<div className="btnAddTask" onClick={this.onAddTaskClick}>
						<div className="btnContent">
							<div className="btnIcon"></div>
							<div className="btnName">Add Task</div>
						</div>
						
					</div>
				</div>

				<div className="pageContent">
					<AddTaskWindow 
						addWinCls={this.state.addWinCls}
						onCancelWinClick={this.onCancelWinClick}
						onContentChange={this.onContentChange}
						onSendClick = {this.onSendClick }
						txtValue = {this.state.txtValue}
					/>
					<div className="toDoList list">
						<div className="title">To do</div>
						<div className="content">
							<ul>
								{todoListGroup}
							</ul>
						</div>
						
					</div>
					<div className="doneList list">
						<div className="title">Done</div>
						<div className="content">
							<ul>
								{doneListGroup}
							</ul>
						</div>
						
					</div>
				</div>

			</div>
			);
	}
}

//新增任務畫面
function AddTaskWindow(props){
	const winCls = props.addWinCls;
	return(
		<div className={props.addWinCls}>
			<div className="winTitle">Add new task</div>
			<div className="content">
				<div className="title">
					Title
				</div>
				<div>
					<input className="txtContent" value={props.txtValue} type="text" onChange={props.onContentChange}/>
				</div>
			</div>
			<div className="footer">
				<div className="btn btnSend" onClick={props.onSendClick}>Send</div>
				<div className="btn btnCancel" onClick={props.onCancelWinClick}>Cancel</div>
			</div>
		</div>
		);
}

// Todo or Done List 實作 
function ListItem(props){
	const {count,type,content} = props;
	const icon = type === "todo"?"icon icon-playback-play":"donListIcon";
	return (
		<li>
			<div className="listContent">
				<div className="listIcon">
					<div className={icon}></div>
				</div>								
				<div className="listText">{count}.{content}</div>
			</div>								
		</li>
		);
}
class PageSubject extends React.Component{
	constructor(props){
		super(props);
	
	}
		
	render(){
		
		return (
			<div className="featureContent">
				
			</div>
			);
	}
}
class PageFree_breakfast extends React.Component{
	constructor(props){
		super(props);
	
	}

	render(){

		return (
			<div className="featureContent">
3
			</div>
			);
	}
}

//圖表
class PageInsert_chart extends React.Component{
	//初始化圖表時間
	constructor(props){
		super(props);
		const nowDate = new Date();
		const dayMs = 24 * 60 * 60 * 1000;
		const starDateMs = nowDate.getTime() - 6 * dayMs;
		const startDate = new Date(starDateMs);
		const weekEndDayString=  `${nowDate.getFullYear()}/${nowDate.getMonth()+1}/${nowDate.getDate()}`;
		const weekStartDayString=  `${startDate.getFullYear()}/${startDate.getMonth()+1}/${startDate.getDate()}`;

		this.state ={
			chartWeek:{
				start:weekStartDayString,
				end:weekEndDayString
			}
		};
		this.getDateList = this.getDateList.bind(this);
		this.getWeekList = this.getWeekList.bind(this);
		this.setChartWeek = this.setChartWeek.bind(this);
		this.createChartData = this.createChartData.bind(this);
	}
	//取得 指定日期的 todo | done list 
	getDateList(list , nowDate){
		return list.filter(function(item){
			const thisDate = new Date(item.date);
			return thisDate.getTime() === nowDate.getTime();
		});
	}
	//取得 指定一周 todo | done list 
	getWeekList(list , nowDate, weekStartDate){
		return list.filter(function(item){
			const theDay = new Date(item.date);
			const isThisWeek = theDay >= weekStartDate  && theDay <=nowDate;
			return  isThisWeek;
		});
	}
	//按圖表一周按鈕動態設定
	setChartWeek(e ,type){
		const {start,end} = this.state.chartWeek;
		const dayMs = 24 * 60 * 60 * 1000;
		const weekMs = 7 * dayMs;
		let newStartMs;		
		let newEndMs ;
		switch(type){
			case "pre":
				newStartMs = new Date(start).getTime() - weekMs ;
				newEndMs = new Date(end).getTime() - weekMs ;	
				break;
			case "next":
				newStartMs = new Date(start).getTime() + weekMs ;
				newEndMs = new Date(end).getTime() + weekMs;	
				break;

		}

		const newStartDate = new Date(newStartMs);
		const newEndDate = new Date(newEndMs);
		const nowDate = new Date();
		if(nowDate < newStartDate)
			return;

		const weekEndDayString=  `${newEndDate.getFullYear()}/${newEndDate.getMonth()+1}/${newEndDate.getDate()}`;
		const weekStartDayString=  `${newStartDate.getFullYear()}/${newStartDate.getMonth()+1}/${newStartDate.getDate()}`;
		const newChartWeek ={
			start:weekStartDayString,
			end:weekEndDayString
		}
		this.setState({
			chartWeek:newChartWeek
		});
	}
	//建立圖表資料
	createChartData(doneList,date){
		const labels = [];
		const dataSetData = [];
		let maxlen= 0;
		const startDate = new Date(date);
		for(let i = 0 ; i < 7; i++){
			const dayMs = 24 * 60 * 60 * 1000;
			const startDateMs =  new Date(startDate).getTime() + (dayMs*i) ;
			const tmpStartDate = new Date(startDateMs);

			const startDateMonth = tmpStartDate.getMonth()+1;
			const month = startDateMonth <10?"0"+startDateMonth:startDateMonth;
			const startDateDay = tmpStartDate.getDate();
			const day = startDateDay <10 ? "0"+ startDateDay: startDateDay;
			const dayString=  `${startDateMonth}/${startDateDay}`;
			const tmpDate = new Date(tmpStartDate.getFullYear()+"/"+dayString);
			const tmplen = this.getDateList(doneList,tmpDate).length;
			labels.push(dayString);
			dataSetData.push(tmplen);
			if(maxlen < tmplen)
				maxlen = tmplen ;
		}
		const data ={
					labels:labels, // 標題
					datasets: [{
						data: dataSetData, 
						backgroundColor: "#F4D03F",
                      	hoverBackgroundColor:"#F4D03F",
						borderWidth: 1 // 外框寬度
					}]
				};
		const option = {
				legend: {//標題
				  	display:false
				},
				layout:{//圖表的 layout
					padding:{
						left:10,
						right:10,
						top:30,
						bottom:10
					}
				},
				scales: {//框線設定
				    xAxes: [
					    {
							gridLines:{
								display:false,
								color: '#FFF'
							},
					    	ticks: {//刻度
					          fontSize: 20,
					          fontColor:"#9F9F9F"
					      }
				  		}
				  	],
				  	yAxes:[
						{
							gridLines:{
								display:false,
								color: '#FFF'
							},
							ticks:{
								min:0,
								max:maxlen+5,
				          		fontColor:"#9F9F9F",
				          		fontSize: 20,
							}	
						}
				  	]
				  }
				};
		const ret = {
			data:data,
			option:option
		}
		return ret;
	}
	render(){
		const nowDate = new Date();
		const weekEndDayString=  `${nowDate.getFullYear()}/${nowDate.getMonth()+1}/${nowDate.getDate()}`;
		const weekStartDayString=  `${nowDate.getFullYear()}/${nowDate.getMonth()+1}/${nowDate.getDate()-7}`;

		const weekStartDate = new Date(weekStartDayString);
		const weekEndDate = new Date(weekEndDayString)
		const {todoList ,doneList} = this.props;
		const todayTodoList = this.getDateList(todoList,weekEndDate); 
		const todayDoneList = this.getDateList(doneList,weekEndDate); 
		const todayListLength =  todayTodoList.length + todayDoneList.length;

		const weekTodoList = this.getWeekList(todoList,weekEndDate,weekStartDate);
		const weekDoneList = this.getWeekList(doneList,weekEndDate,weekStartDate);
		const weekListLength =  weekTodoList.length + weekDoneList.length;

		const {start,end} = this.state.chartWeek;
		const chartData= this.createChartData(doneList,start); 
		
		return (
			<div>
				<div className="numberStatistics">
					<NumberStatistics
						type="Toady"
						date={weekEndDayString}
						listCount={todayListLength}
						doneCount={todayDoneList.length}
					/>
					<NumberStatistics
						type="Week"
						date=""
						listCount={weekListLength}
						doneCount={weekDoneList.length}
					/>
				</div>
				<div className="chartStatistics">
					<div className="nav">
						<span className="title">
							Chart
						</span>
						<div className="weekControl">
							<div  className="btn btnPre" onClick={(e)=>{ this.setChartWeek(e,"pre");}}>
								<div className="arrow yellow "></div>
								<div className="arrow background "></div>
							</div>
							<div className="weekView">{start} ~ {end}</div>
							<div  className="btn btnNext" onClick={(e)=>{ this.setChartWeek(e,"next");}}>
								<div className="arrow yellow "></div>
								<div className="arrow background "></div>
							</div>
						</div>
					</div>
					<div className="content">
						<Bar
							data={chartData.data}
							options={chartData.option}
							/>
					</div>
				</div>
			</div>
			);
	}
}
//數字統計 顯示 當天 & 當周的 todo/done
function NumberStatistics(props){
	const {type,date,listCount,doneCount} = props;
	const listCountString = listCount <10? `0${listCount}`: listCount;
	const doneCountString = doneCount <10 ? `0${doneCount}`: doneCount;
	return (
		<div className="column">
			<div className="title">
				<span className="type">{type}</span>
				<span className="date">{date}</span>
			</div>
			<div className="content">
				<div className="data list">
					<div>{listCountString}</div>
					<div className="title">List</div>
				</div>
				<div className="separation"></div>
				<div className="data done">
					<div>{doneCountString}</div>
					<div className="title">Done</div>
				</div>
			</div>
		</div>
		);

}

//設定鈴聲
class PageSettings extends React.Component{
	constructor(props){
		super(props);
		this.state ={
			ring : this.props.ringList
		}
		this.ringList =["None","Horse","LionKing","Mario"];
		this.createRadioGroup = this.createRadioGroup.bind(this);
		this.onRadioGroupChange = this.onRadioGroupChange.bind(this);
	}

	//建立鈴聲選單
	createRadioGroup(gpName){
		const ret=[];
		const {ring} = this.state;
		this.ringList.map((item)=>{
			const isChecked = ring[gpName] === item;
			const tmp = <RadioButton radioID={gpName+"_"+item} radioText={item} radioName={gpName} isChecked={isChecked}/>
			ret.push(tmp);
		});
		return ret;
	}
	//選項切換時的事件
	onRadioGroupChange(e,type){
		console.log(e.target)
		const selectedRing = e.target.value;
		this.state.ring[type] = selectedRing;
		this.props.featuresListener("setting",this.state.ring);
		this.setState({
			ring:this.state.ring
		});
	}
	render(){
		const workRingList = this.createRadioGroup("work");
		const breakRingList = this.createRadioGroup("break");
		return (
			<div >
				<div className="settingArea workArea">
					<div className="title">Work</div>
					<div className="content" onChange={(e)=>{this.onRadioGroupChange(e,"work")}}>
						{workRingList}
					</div>
				</div>
				<div className="settingArea breakArea">
					<div className="title">Break</div>
					<div className="content" onChange={(e)=>{this.onRadioGroupChange(e,"break")}}>
						{breakRingList}
					</div>
				</div>
			</div>
			);
	}
}

//建立鈴聲選項按鈕
function RadioButton(props){
	const {radioID,radioName,radioText,isChecked} = props;
	return(
		<div className="radioItem">
			<input type="radio" id={radioID} name={radioName} value={radioText} checked={isChecked}/>
    		<label htmlFor={radioID}>
    			<span className="radioBorder">
    				<span className="radopChecked"></span>
    			</span>
    			{radioText}
    		</label>
		</div>
			);
}

//功能選單
class MenuList extends React.Component{
	constructor(props){
		super(props);
		this.getMenuItemIcon = this.getMenuItemIcon.bind(this);
		this.onMenuItemClick = this.onMenuItemClick.bind(this);
	}
	//取得選單 Icon 判斷目前是否有被激活
	getMenuItemIcon(menu){
		const nowActivePage = this.props.nowActivePage;
		const isActive = nowActivePage === menu;
		const ret = isActive?"active":"";
		return ret;
	}
	//按下選單後的事件
	onMenuItemClick(e){
		const target = e.target;
		const menuName = target.dataset.menuname;
		this.props.setPageChange(menuName);
	}
	render(){
		const homeIcon = `menuIcon ${this.getMenuItemIcon("home")} fa fa-home`;
		const subjectIcon = `menuIcon2 ${this.getMenuItemIcon("subject")} menu-subject`;
		const free_breakfastIcon = `menuIcon2 ${this.getMenuItemIcon("free_breakfast")} menu-free_breakfast`;
		const insert_chartIcon = `menuIcon2 ${this.getMenuItemIcon("insert_chart")} menu-insert_chart`;
		const settingsIcon = `menuIcon2 ${this.getMenuItemIcon("settings")} menu-settings`;
		return (
			<div className="menuList">
				<div className="menuItem">
					<div className={homeIcon} data-menuname="home" onClick={this.onMenuItemClick}></div>
				</div>
				<div className="menuItem">
					<div className={insert_chartIcon} data-menuname="insert_chart" onClick={this.onMenuItemClick}></div>
				</div>
				<div className="menuItem">
					<div className={settingsIcon} data-menuname="settings" onClick={this.onMenuItemClick}></div>
				</div>
			</div>
			);
	}
}