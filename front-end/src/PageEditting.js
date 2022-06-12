import './PageEditting.css'
import $ from 'jquery'
import 'jquery-ui'
import { useEffect, useState } from 'react'

const PageEditting = ()=>{
    const [selected_element, SelectElement] = useState(null)
    const [elements, updateElements] = useState([]);

    var initX, initY   

    const updateElement = (id, {top = null, left = null, backgroundColor = null, height = null, width = null})=>{
        if(top == null) top = elements[id].top
        if(left == null) left = elements[id].left
        if(backgroundColor == null) backgroundColor = elements[id].backgroundColor
        if(height == null) height = elements[id].height
        if(width == null) width = elements[id].width
        const temp_array = elements
        temp_array[id].top = top;
        temp_array[id].left = left;
        temp_array[id].backgroundColor = backgroundColor;
        temp_array[id].height = height;
        temp_array[id].width = width;
        updateElements([...temp_array])
    }

    const mouseMove = (event, element)=>{
        updateElement(element.id, element.top - initY + event.clientY, element.left - initX + event.clientX)
        initY = event.clientY
        initX = event.clientX
    }

    const mouseDown = (event, element)=>{
        onmousemove = (event)=>{mouseMove(event, element)}
        onmouseup = mouseUp
        initX = event.clientX;
        initY = event.clientY;
    }

    const mouseUp = (element) =>{
        onmousemove = null
        onmouseup = null
    }

    const dblclick = (element , event=null)=>{
        event.stopPropagation()
        SelectElement(element)
    }
    const removeSelected = (event=null)=>{
       SelectElement(null)
    }

    const topChanged = (event)=>{
        var val = parseFloat(event.target.value)
        if (val != NaN)
            updateElement(selected_element.id, {top: val})
    }
    const leftChanged = (event)=>{
        var val = parseFloat(event.target.value)
        if (val != NaN)
            updateElement(selected_element.id, {left: val})
    }
    const backgroundChanged = (event)=>{
        var val = parseFloat(event.target.value)
        if (val != NaN)
            updateElement(selected_element.id, {backgroundColor:val})
    }
    const widthChanged = (event)=>{
        var val = parseFloat(event.target.value)
        if (val != NaN)
            updateElement(selected_element.id, {width: val})
    }
    const heightChanged = (event)=>{
        var val = parseFloat(event.target.value)
        if (val != NaN)
            updateElement(selected_element.id, {height: val})
    }
    const test = ()=>{
        updateElement(1, 50, 500)
        const wait = setTimeout(()=>{
            updateElement(0, 500, 500)
        }, 2000)
        const wait2 = setTimeout(()=>{
            updateElement(1, 50, 50)
        }, 4000)
        const wait3 = setTimeout(()=>{
            updateElement(0, 500, 50)
        }, 4000)
    }
    const generateHTML = (element)=>{
        if(element.type == "box")
        return (<div id={element.id} key={element.id} className="element" onDoubleClick={(event)=>dblclick(element, event)} onMouseDown={(event)=>{mouseDown(event, element)}} style={{
            "top": element.top,
            "left": element.left,
            "width": element.width,
            "height": element.height,
            "borderRadius": element.border_radius,
            "backgroundColor": element.backgroundColor,
        }}></div>)
        else if(element.type == "circle"){
            return (<div id={element.id} key={element.id} className="element" onDoubleClick={(event)=>dblclick(element, event)} onMouseDown={(event)=>{mouseDown(event, element)}} style={{
                "top": element.top,
                "left": element.left,
                "width": element.radius,
                "height": element.radius,
                "borderRadius": "50%",
                "backgroundColor": element.backgroundColor
            }}></div>)
        }
    }

    function Box(id, top, left, width, height, border_radius, backgroundColor) {
        this.id = id;
        this.type = "box"
        this.top = top
        this.left = left
        this.width = width;
        this.height = height;
        this.border_radius = border_radius;
        this.backgroundColor = backgroundColor
    }
    function Circle(id, top, left, radius, backgroundColor){
        this.id = id;
        this.type = "circle"
        this.top = top;
        this.left = left;
        this.radius = radius;
        this.backgroundColor = backgroundColor;
    }

    function toggle(){
        if ($(".toolbar").hasClass("inactive"))
        {
            $('.toolbar').slideDown(300)
            $(".toolbar").removeClass("inactive")
        }
        else{            
            $('.toolbar').slideUp(300)
            $(".toolbar").addClass("inactive")
        }
    }

    function toggleElementProperties(){
        if ($(".elementProperties").hasClass("inactive")){
            $(".selectedElement").addClass("active")
            $('.elementProperties').slideDown(300)
            $(".elementProperties").removeClass("inactive")
        }
        else{            
            $(".selectedElement").removeClass("active")
            $('.elementProperties').slideUp(300)
            $(".elementProperties").addClass("inactive")
        }
    }

    function addElement(item){
        var new_element;
        var id = elements.length;
        if(item == "box")
            new_element = new Box(id, 10, 10, 300, 400, "5% 5%", "red");
        else if(item == "circle")
            new_element = new Circle(id, 500, 400, 300, "red");
        var array = elements;
        array.push(new_element)
        updateElements([...array])
    }

    useEffect(()=>{
        $(".toolbar").addClass("inactive")
        $(".elementProperties").addClass("inactive")
        $('.toolbar').hide(0)
        $(".elementProperties").hide(0)
    }, [])
    useEffect(() => {
        if(selected_element){
            document.getElementById(selected_element.id).classList.add("selected")
        }
        else{
            elements.forEach(element => {
                if(document.getElementById(element.id).classList.contains("selected"))
                    document.getElementById(element.id).classList.remove("selected")
            });
        }
    })

    return(
        <div className="pageEditting">
            <div className="sideBar" style={{"height": "auto"}}>
                <div className='toggle' style={{"width": "50px", "height": "auto"}} onClick={toggle}><img src='/settings.png' width="50px" height="50px"></img></div>
                <div className='toolbar'>
                    <div className='TestingButton'><button onClick={test}>Test</button></div>
                    <div className='heading'>SHAPES</div>
                    <div className="tools">
                    <div className='item' id='box' onClick={()=>{addElement("box")}}><div id='boxImage'></div></div>
                    <div className='item' id='circle' onClick={()=>{addElement("circle")}}><div id='circleImage'></div></div>
                    <div className='item' id='text' onClick={()=>{addElement("text")}}><div id='textImage'>TEXT</div></div>
                    </div>
                </div>
            </div>
            <div className="workArea">
                <div className='htmlOut' onClick={(event)=>{removeSelected(event)}}>
                    {
                        elements.map((element)=>{
                            return generateHTML(element)
                        })
                    }
                </div>
                <div className='elementData'>
                    <div className="selectedElement" onClick={toggleElementProperties}>
                    {selected_element ? <div className='elementName'>Element {selected_element.id} <b>˅</b></div> : <div className='elementName'>none <b>˅</b></div>}
                    </div>
                    {selected_element ?
                        <div className='elementProperties'>
                            <form onSubmit={(e)=>{e.preventDefault()}}>
                                <div className='text'>Top</div><input type="text" defaultValue={selected_element.top} onChange={topChanged}></input>
                                <div className='text'>Left</div><input type="text" defaultValue={selected_element.top} onChange={leftChanged}></input>
                                <div className='text'>Color</div><input type="color" defaultValue={selected_element.top} onChange={backgroundChanged}></input>
                                <div className='text'>Width</div><input type="text" defaultValue={selected_element.top} onChange={widthChanged}></input>
                                <div className='text'>Height</div><input type="text" defaultValue={selected_element.top} onChange={heightChanged}></input>
                            </form>
                        </div>
                        :
                        <div className='elementProperties'>

                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default PageEditting