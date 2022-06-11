import './PageEditting.css'
import $ from 'jquery'
import 'jquery-ui'
import { useEffect, useState } from 'react'

const PageEditting = ()=>{
    const [selected_element, SelectElement] = useState("none")
    const [equipped_tool, EquipTool] = useState("none");
    const [elements, updateElements] = useState([]);

    var selectedElement = NaN;
    var dragX = 0;
    var dragY = 0;



    const dragstart = (element)=>{
        console.log(elements)
        for(var i=0; i<elements.length; i++){
            if(elements[i].id == element.id){
                selectedElement = element
                break;
            }
        };
    }

    const drag = (event)=>{
        updateElement(selectedElement.id, event.clientY - selectedElement.height/2, event.clientX-selectedElement.width/2)
    }

    const dragend = (event)=>{
        console.log(elements)
        updateElement(selectedElement.id, event.clientY - selectedElement.height/2, event.clientX-selectedElement.width/2)
    }


    const updateElement = (id, top, left)=>{
        const temp_array = [...elements]
        temp_array[id].top = top;
        temp_array[id].left = left;
        updateElements([...temp_array])
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
        this.GetHtml = ()=>{
            return (<div id={this.id} key={this.id} className="element" draggable="true" onDragStart={()=>{dragstart(this)}} onDrag={drag} onDragEnd={dragend} style={{
                "top": this.top,
                "left": this.left,
                "width": this.width,
                "height": this.height,
                "borderRadius": this.border_radius,
                "backgroundColor": this.backgroundColor,
            }}></div>)
        }
    }
    function Circle(id, top, left, radius, backgroundColor){
        this.id = id;
        this.type = "circle"
        this.top = top;
        this.left = left;
        this.radius = radius;
        this.backgroundColor = backgroundColor;
        this.GetHtml = ()=>{
            return (<div id={this.id} key={this.id} draggable="true" className="element" onDragStart={()=>{console.log(elements); dragstart(this)}} onDrag={()=>{drag(this)}} onDragEnd={()=>{dragend(this)}} style={{
                "top": this.top,
                "left": this.left,
                "width": this.radius,
                "height": this.radius,
                "borderRadius": "50%",
                "backgroundColor": this.backgroundColor
            }}></div>)
        }
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
        EquipTool(item)
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

    return(
        <div className="pageEditting">
            <div className="sideBar" style={{"height": "auto"}}>
                <div className='toggle' style={{"width": "50px", "height": "auto"}} onClick={toggle}><img src='/settings.png' width="50px" height="50px"></img></div>
                <div className='toolbar'>
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
                            return element.GetHtml()
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