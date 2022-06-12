import './PageEditting.css'
import $ from 'jquery'
import 'jquery-ui'
import { useEffect, useState } from 'react'

const PageEditting = ()=>{
    const [selected_element, SelectElement] = useState("none")
    const [elements, updateElements] = useState([]);

    var initX, initY   

    const updateElement = (id, top, left)=>{
        const temp_array = elements
        temp_array[id].top = top;
        temp_array[id].left = left;
        updateElements([...temp_array])
    }

    const mouseMove = (event, element)=>{
        console.log(event.clientX, event.clientY)
        const docEl = document.getElementById(element.id)
        updateElement(element.id, element.top - initY + event.clientY, element.left - initX + event.clientX)
        initY = event.clientY
        initX = event.clientX
    }

    const mouseDown = (event, element)=>{
        console.log(element)
        onmousemove = (event)=>{mouseMove(event, element)}
        onmouseup = mouseUp
        initX = event.clientX;
        initY = event.clientY;
    }

    const mouseUp = (element) =>{
        onmousemove = null
        onmouseup = null
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
        return (<div id={element.id} key={element.id} className="element" onMouseDown={(event)=>{mouseDown(event, element)}} style={{
            "top": element.top,
            "left": element.left,
            "width": element.width,
            "height": element.height,
            "borderRadius": element.border_radius,
            "backgroundColor": element.backgroundColor,
        }}></div>)
        else if(element.type == "circle"){
            return (<div id={element.id} key={element.id} className="element" style={{
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
    // useEffect(() => {
        
    // })

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
                <div className='htmlOut'>
                    {
                        elements.map((element)=>{
                            return generateHTML(element)
                        })
                    }
                </div>
                <div className='elementData'>
                    <div className="selectedElement" onClick={toggleElementProperties}>
                        <div className='elementName'>{selected_element} <b>˅</b></div>
                    </div>
                    <div className='elementProperties'>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageEditting