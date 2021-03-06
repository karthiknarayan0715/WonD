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
    const [isSaving, SetIsSaving] = useState(false)
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

    //TODO: 
    // window.addEventListener("beforeunload", (event)=>{
    //     event.preventDefault();
    //     event.returnValue = '';
    // })
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
            var id = response.elements[i]._id
            var element = await JSON.parse(response.elements[i].elements)
            array.push(new Element(id, element.id, element.top, element.left, element.width, element.height, element.borderRadius, element.backgroundColor, element.text))
        }
        updateElements(array)
    }

    const save = async ()=>{
        SetIsSaving(true)
        const req = {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({"elements": elements})
        }
        const res = await fetch(`${server_url}/api/websites/routes/elements/save`, req)
        const response = await res.json()
        SetIsSaving(false)
    }

    useEffect(()=>{
        if(curRoute!=null)
        getElements()
    }, [curRoute])
    
    useEffect(()=>{
        document.onkeydown = (event)=>{
            if(event.ctrlKey && event.key == "s"){
                event.preventDefault()
                console.log("saving...")
                save()
            }
            if(selected_element && event.key == "Delete"){
                console.log("deleting..")
                removeElement(selected_element)
            }
        }
        if(elements.length > 0){
            elements.forEach((element)=>{
                const elHTML = document.getElementById(element.id)
                elHTML.addEventListener("mousedown", (event) => mouseDown(element, event))
                elHTML.addEventListener("dblclick", (event) => dblclick(element, event))
            })
        }
    }, [elements, selected_element])



    //#region Updating the Element

    const updateElement = (id, {top = null, left = null, width = null, height = null, borderRadius = null, backgroundColor = null, text = null, fontColor = null})=>{
        if(elements.length > 0){
            if (top == null) top = elements[id].top
            if (left == null) left = elements[id].left
            if (width == null) width = elements[id].width
            if (height == null) height = elements[id].height
            if (borderRadius == null) borderRadius = elements[id].borderRadius
            if (backgroundColor == null) backgroundColor = elements[id].backgroundColor
            if (text == null) text = elements[id].text
            if (fontColor == null) fontColor = elements[id].fontColor

            var array = elements 
            array[id].top = top
            array[id].left = left
            array[id].width = width
            array[id].height = height
            array[id].borderRadius = borderRadius
            array[id].backgroundColor = backgroundColor
            array[id].text = text
            array[id].fontColor = fontColor

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
    const fontColorChanged = (event)=>{
        updateElement(selected_element.id, {fontColor:event.target.value})
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
    const borderRadiusChanged = (event)=>{
        var val = event.target.value
        updateElement(selected_element.id, {borderRadius: val})
    }
    const textChanged = (event)=>{
        var val = event.target.value
        updateElement(selected_element.id, {text: val})
    }
    //#endregion
    
    function Element(db_id, id, top, left, width, height, borderRadius, backgroundColor, text, fontColor){
        this.db_id = db_id
        this.id = id;
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.borderRadius = borderRadius;
        this.backgroundColor = backgroundColor;
        this.text = text;
        this.fontColor = fontColor?fontColor:"#000000"


        this.getHTML = ()=>{
            return (
                <div className={`element ${this.db_id}`} key={this.id} id={this.id} style={{
                    "top": this.top, 
                    "left": this.left, 
                    "width": this.width, 
                    "height": this.height, 
                    "borderRadius": this.borderRadius,
                    "backgroundColor": this.backgroundColor,
                    "color": this.fontColor
                }}><div className='text'>{this.text}</div></div>

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
    const removeElement = async (element)=>{
        var array = elements;
        const index = array.indexOf(element)
        var response = null;
        if(index!=-1){
            array.splice(index, 1)
            const req = {
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({"element": element})
            }
            const res = await fetch(`${server_url}/api/websites/routes/elements/remove`, req)
            response = await res.json()
        }
        SelectElement(null)
        if(response && response.result == "success"){
            for(var i=0; i<array.length; i++)
            {
                array[i].id = i;
            }
            updateElements([...array])
            save()
        }
    }

    async function addElement(item){
        var new_element;
        var id = elements.length;
        if(item == "box")
            new_element = new Element(null, id, 10, 10, 300, 400, "0%", "#000000");
        else if(item == "circle")
            new_element = new Element(null, id, 10, 10, 300, 300, "50%", "#000000");
        const req = {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({"cur_route_id": curRoute._id, element_data: new_element})
        }
        const res = await fetch(`${server_url}/api/websites/routes/elements/add`, req)
        const response = await res.json()
        if(response.result == "success"){
            var new_element_data = JSON.parse(response.element.elements)
            new_element = new Element(new_element_data.db_id, new_element_data.id, new_element_data.top, new_element_data.left, new_element_data.width, new_element_data.height, new_element_data.borderRadius, new_element_data.backgroundColor, new_element_data.text, new_element_data.fontColor)
            console.log(new_element)
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
        {
            isSaving && 
            <div className="saving">
                <div className="savingText">saving...</div>
            </div>
        }
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
                                                <div className='route' key={route._id} onClick={()=>{save(); SetCurRoute(route)}}>{route.name}</div>
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
                    {selected_element ? <div className='elementName'>Element {selected_element.id} <b>??</b></div> : <div className='elementName'>none <b>??</b></div>}
                    </div>
                    {selected_element ?
                        <div className='elementProperties'>
                            <form>
                                <div className='text'>Top</div><input type="text" defaultValue={selected_element.top} onChange={topChanged}></input>
                                <div className='text'>Left</div><input type="text" defaultValue={selected_element.left} onChange={leftChanged}></input>
                                <div className='text'>Color</div><input type="color" defaultValue={selected_element.backgroundColor} onChange={backgroundChanged}></input>
                                <div className='text'>Width</div><input type="text" defaultValue={selected_element.width} onChange={widthChanged}></input>
                                <div className='text'>Height</div><input type="text" defaultValue={selected_element.height} onChange={heightChanged}></input>
                                <div className='text'>Border Radius</div><input type="text" defaultValue={selected_element.borderRadius} onChange={borderRadiusChanged}></input>
                                <div className='text'>Text</div><input type="text" defaultValue={selected_element.text} onChange={textChanged}></input>
                                <div className='text'>Font Color</div><input type="color" defaultValue={selected_element.fontColor} onChange={fontColorChanged}></input>
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