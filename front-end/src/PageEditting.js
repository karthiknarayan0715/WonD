import './PageEditting.css'
import $, { event } from 'jquery'
import 'jquery-ui'
import Cookies from 'universal-cookie'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const PageEditting = ()=>{
    const [selected_element, SelectElement] = useState(null)
    const [elements, updateElements] = useState([]);
    const [siteId, setSiteId] = useState(null)
    const [user, setUser] = useState(null)
    const [site, setSite] = useState(null)
    const [routes, setRoutes] = useState(null)
    const [curRoute, SetCurRoute] = useState(null)
    const [newRouteName, SetNewRouteName] = useState(null)
    const [windowOpen, SetWindowOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const cookies = new Cookies()
    const jwt = cookies.get("jwt")
    const server_url = "http://127.0.0.1:5000"

    const verifyJWT = async ()=>{
        const req = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"jwt": jwt})
        }
        const res = await fetch(`${server_url}/api/getUserData`, req)
        const response = await res.json()
        setUser(response.user)
    }

    const getSiteData = async ()=>{
        const req = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"site_id": siteId})
        }
        const res = await fetch(`${server_url}/api/getSite`, req)
        const response = await res.json()
        setSite(response.site)
        setRoutes(response.routes)
    }
    useEffect(()=>{
        $(".toolbar").addClass("inactive")
        $(".elementProperties").addClass("inactive")
        $('.toolbar').hide(0)
        $(".elementProperties").hide(0)
        if(!cookies.get("jwt")) navigate("/login")
        if(location.state){
            setSiteId(location.state.site_id)
            verifyJWT()
        }
        else
            navigate("/webpages")
    }, [])

    useEffect(() => {
        if(selected_element){
            document.getElementById(selected_element.id).classList.add("selected")
        }
        else{
            elements.forEach(element => {
                const docEl = document.getElementById(element.id)
                if(docEl && docEl.classList.contains("selected")){
                    docEl.classList.remove("selected")
                }
            });
        }
    })
    useEffect(()=>{
        getSiteData()
    }, [siteId])

    useEffect(()=>{
        if(routes && routes.length > 0)
            SetCurRoute(routes[0])
    }, [routes])

    const getElements = async ()=>{
        const req = {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({"route_id": curRoute._id})
        }
        const res = await fetch(`${server_url}/api/websites/routes/elements`, req)
        const response = await res.json()
        var array = []
        for(var i=0; i<response.elements.length; i++){
            var element = await JSON.parse(response.elements[i].elements)
            array.push(new Element(element.id, element.top, element.left, element.width, element.height, element.border_radius, element.backgroundColor, element.text))
        }
        updateElements(array)
    }

    const save = ()=>{

    }

    useEffect(()=>{
        if(curRoute!=null)
        getElements()
    }, [curRoute])
    useEffect(()=>{
        if(elements.length > 0){
            elements.forEach((element)=>{
                const elHTML = document.getElementById(element.id)
                elHTML.addEventListener("mousedown", (event) => mouseDown(element, event))
                elHTML.addEventListener("dblclick", (event) => dblclick(element, event))
            })
        }
    }, [elements])

    //#region Updating the Element

    const updateElement = (id, {top = null, left = null, width = null, height = null, borderRadius = null, backgroundColor = null, text = null})=>{
        if(elements.length > 0){
            if (top == null) top = elements[id].top
            if (left == null) left = elements[id].left
            if (width == null) width = elements[id].width
            if (height == null) height = elements[id].height
            if (borderRadius == null) borderRadius = elements[id].borderRadius
            if (backgroundColor == null) backgroundColor = elements[id].backgroundColor
            if (text == null) text = elements[id].text

            var array = elements 
            array[id].top = top
            array[id].left = left
            array[id].width = width
            array[id].height = height
            array[id].borderRadius = borderRadius
            array[id].backgroundColor = backgroundColor
            array[id].text = text

            updateElements([...array])
        }
    }

    var initX = 0, initY = 0;
    const mouseMove = (event, element)=>{
        updateElement(element.id, {top: element.top - initY + event.clientY, left: element.left - initX + event.clientX})
        initY = event.clientY
        initX = event.clientX
    }

    const mouseDown = (element, event)=>{
        onmousemove = (event)=>{mouseMove(event, element)}
        onmouseup = mouseUp
        initX = event.clientX;
        initY = event.clientY;
    }

    const mouseUp = () =>{
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
        updateElement(selected_element.id, {backgroundColor:event.target.value})
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
    //#endregion
    
    function Element(id, top, left, width, height, border_radius, backgroundColor, text){
        this.id = id;
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.border_radius = border_radius;
        this.backgroundColor = backgroundColor;
        this.text = text;

        this.getHTML = ()=>{
            return (
                <div className='element' key={this.id} id={this.id} style={{
                    "top": this.top, 
                    "left": this.left, 
                    "width": this.width, 
                    "height": this.height, 
                    "borderRadius": this.border_radius, 
                    "backgroundColor": this.backgroundColor
                }}>{this.text}</div>

            )
        }
    }
    function toggle(){
        if(!windowOpen){
            if($(".allRoutes").hasClass("active")){
                toggleRoutes();
            }
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

    async function addElement(item){
        var new_element;
        var id = elements.length;
        if(item == "box")
            new_element = new Element(id, 10, 10, 300, 400, "0%", "#000000");
        else if(item == "circle")
            new_element = new Element(id, 10, 10, 300, 300, "50%", "#000000");
        const req = {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({"cur_route_id": curRoute._id, element_data: new_element})
        }
        const res = await fetch(`${server_url}/api/websites/routes/elements/add`, req)
        const response = await res.json()
        if(response.result == "success"){
            updateElements([...elements, new_element])
        }
    }

    function toggleRoutes(){
        if($(".allRoutes").hasClass("active")){
            $(".allRoutes").removeClass("active")
        }
        else{
            $(".allRoutes").addClass("active")
        }
    }
    const openWindow = ()=>{
        SetWindowOpen(true)
        toggleRoutes()
        toggle()
        $(".window-back").addClass("active")
    }
    const closeWindow = ()=>{
        SetWindowOpen(false)
        $(".window-back").removeClass("active")
    }

    const addRoute = async ()=>{
        const req = {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({"site_id": siteId, "route_name": newRouteName})
        }
        const res = await fetch(`${server_url}/api/websites/routes/add`, req)
        const response = await res.json()
        if(response.result == "success"){
            getSiteData()
            closeWindow()
        }
    }
    const getHTML = ()=>{
        const html = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>${site.name}</title>
                </head>
                <body>
                    ${
                        elements.map((element)=>{
                            return element.getHTML()
                        })
                    }
                </body>
            </html>
        `
    }

    return(
        <div>
        <div className="pageEditting">
            <div className="sideBar" style={{"height": "auto"}}>
                <div className='toggle' style={{"width": "50px", "height": "auto"}} onClick={toggle}><img src='/settings.png' width="50px" height="50px"></img></div>
                <div className='toolbar'>
                    {routes && site && curRoute &&
                        <div className='routeData'>
                            <div className='siteName'>{site.name}</div>
                            <div className='routes'>
                                <div className='curRoute' onClick={toggleRoutes}><div className='text'>{curRoute.name}</div></div>
                                <div className='allRoutes'>
                                    {
                                        routes.map((route)=>{
                                            return (
                                                <div className='route' key={route._id}>{route.name}</div>
                                            )
                                        })
                                    }
                                    <div className='route' onClick={openWindow}>New route</div>
                                </div>
                            </div>
                        </div>
                    }
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
                            return element.getHTML()
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
                                <div className='text'>Left</div><input type="text" defaultValue={selected_element.left} onChange={leftChanged}></input>
                                <div className='text'>Color</div><input type="color" defaultValue={selected_element.backgroundColor} onChange={backgroundChanged}></input>
                                <div className='text'>Width</div><input type="text" defaultValue={selected_element.width} onChange={widthChanged}></input>
                                <div className='text'>Height</div><input type="text" defaultValue={selected_element.height} onChange={heightChanged}></input>
                            </form>
                        </div>
                        :
                        <div className='elementProperties'>

                        </div>
                    }
                </div>
            </div>
        </div>
        <div className="window-back">
            <div className="window">
                <div className="heading"><div className="text">New Site</div><div id="closeButton" onClick={closeWindow}>X</div></div>
                <div className="form-content">
                    <div style={{"display": "block"}}>
                        <div className="text">Route Name</div><input type="text" onChange={(event)=>{SetNewRouteName(event.target.value)}}></input><br></br><br></br>
                        <div className="button"><button onClick={addRoute}>Add Route</button></div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

PageEditting.defaultProps = {
    "site_id": null
}

export default PageEditting