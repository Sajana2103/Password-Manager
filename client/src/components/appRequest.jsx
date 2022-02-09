import React from "react";

const Requests = () =>{
  const [pass,setPass] = React.useState([])
  const onChange = (e) => {
    setPass(e.target.value)
  }
  console.log(pass)
  return(
    <div>
      <input id="password-card-input" onChange={onChange}/>
      REQUESTS
    </div>
  )
}

export default Requests