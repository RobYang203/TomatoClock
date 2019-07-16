//功能設定區
export default class FeaturesArea extends React.Component{
	constructor(props){
		super(props);	
		this.state ={
			nowActivePage:"home"
		}
		this.getActivePage = this.getActivePage.bind(this);
		this.setPageChange =this.setPageChange.bind(this);
	}

	setPageChange(menu){
		this.setState({
			nowActivePage:menu
		});
	}

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
			ret = <PageInsert_chart/>;
			break;
			case "settings":
			ret = <PageSettings/>;
			break;
		}
		return ret;
	}
	render(){
		const nowActiveFeature = this.getActivePage(this.state.nowActivePage);
		return (
			<div className="featuresArea">
				<div className="featureContent">
					{nowActiveFeature}
				</div>
				<MenuList
					nowActivePage = {this.state.nowActivePage}
					setPageChange = {this.setPageChange}
				/>
			</div>
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
	onAddTaskClick(e){
		this.setState({
			addWinCls:"windAddNewTask"
		});
	}
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
	onCancelWinClick(){
		this.setState({
			addWinCls:"windAddNewTask hidden",
			txtValue:""
		});
	}
	onContentChange(e){
		const stateValue = this.state;
		const txtValue = e.target.value;
		stateValue.txtValue = txtValue;
		this.setState(stateValue);
	}
	onSendClick(){

		this.props.featuresListener(this.state.txtValue);
		this.setState({
			addWinCls:"windAddNewTask hidden",
			txtValue:""
		});
	}
	render(){
		const {todoList,doneList}=this.props;
		const todoListGroup = this.getListItem(todoList);
		const doneListGroup = this.getListItem(doneList);
		return (
			<div className="Page">
				<div className="btnAddTask" onClick={this.onAddTaskClick}>
					<div className="btnContent">
						<div className="btnIcon"></div>
						<div className="btnName">Add Task</div>
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
						<ul>
							{todoListGroup}
						</ul>
					</div>
					<div className="doneList list">
						<div className="title">Done</div>
						<ul>
							{doneListGroup}
						</ul>
					</div>
				</div>

			</div>
			);
	}
}
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
2
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
class PageInsert_chart extends React.Component{
	constructor(props){
		super(props);
	
	}

	render(){

		return (
			<div className="featureContent">
4
			</div>
			);
	}
}
class PageSettings extends React.Component{
	constructor(props){
		super(props);
	
	}

	render(){

		return (
			<div className="featureContent">
5
			</div>
			);
	}
}

class MenuList extends React.Component{
	constructor(props){
		super(props);
		this.getMenuItemIcon = this.getMenuItemIcon.bind(this);
		this.onMenuItemClick = this.onMenuItemClick.bind(this);
	}
	getMenuItemIcon(menu){
		const nowActivePage = this.props.nowActivePage;
		const isActive = nowActivePage === menu;
		const ret = isActive?"active":"";
		return ret;
	}
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
					<div className={subjectIcon} data-menuname="subject" onClick={this.onMenuItemClick}></div>
				</div>
				<div className="menuItem">
					<div className={free_breakfastIcon} data-menuname="free_breakfast" onClick={this.onMenuItemClick}></div>
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