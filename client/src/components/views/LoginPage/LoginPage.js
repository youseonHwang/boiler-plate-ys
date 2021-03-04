import React, { useState } from 'react'
import { loginUser } from '../../../_actions/user_actions'
import { useDispatch } from 'react-redux'; // dispatch를 이용해 action을 취함.
import { withRouter } from 'react-router-dom' // history가 withRouter를 사용하고 있는 것

function LoginPage(props) {

  const dispatch = useDispatch()

  // 안에서 데이터를 변화시키려고 할때 state 사용
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  /* 타이핑을 할 때 onchange 발생 -> state를 바꿈 -> value가 바뀌는 로직 */
  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  /* Form 제출 메소드 */
  const onsubmitHandler = (event) => {
    event.preventDefault(); // 페이지 리프레쉬를 막음.(원래 해놔야 하는 일들을 하는게 아니라)
    console.log('Email:', Email) // 이벤트로 넘어온거 확인
    console.log('Password:', Password)

    let body = {
      email: Email,
      password: Password
    }

    // 적용: dispatch({type:액션타입})
    dispatch(loginUser(body)) //action을 취함
      .then(response => {
        if (response.payload.loginSuccess) {
          props.history.push('/')
        } else {
          alert(Error)
        }
      })
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }} >
      <form style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onsubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <button type="submit">
          Login
        </button>
      </form>
    </div>
  )
}

export default withRouter(LoginPage)
