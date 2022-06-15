const Box = (props)=>{
    return <div className="box" onClick={props.onClick} style={{width : props.width, height : props.height, fontSize: props.fontSize}}>{props.text}</div>
}

Box.defaultProps = {
    "width": '150px',
    'height': '40px',
    'text': 'Default Button',
    'fontSize': '23px',
    'onClick': ()=>{}
}
export default Box;