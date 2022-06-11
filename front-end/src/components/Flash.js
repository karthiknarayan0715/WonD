const Flash = (props)=>{
    if(props.status == "error"){
        return (
            <div className="error">
            <div className="text" style={{"color": "red"}}>{props.message}</div>
            </div>
        )
    }
    else if(props.status == "success"){
        return (
            <div className="error">
            <div className="text" style={{"color": "green"}}>{props.message}</div>
            </div>
        )
    }
}

export default Flash