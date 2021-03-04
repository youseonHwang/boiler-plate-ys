import React, { useState } from 'react'
import { registerUser } from '../../../_actions/user_actions'
import { useDispatch } from 'react-redux'; // dispatch를 이용해 action을 취함.
import { withRouter } from 'react-router-dom'

function RegisterPage(props) {

  const dispatch = useDispatch()

  // 안에서 데이터를 변화시키려고 할때 state 사용
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const [Name, setName] = useState("")
  const [ConfirmPassword, setConfirmPassword] = useState("")

  /* 타이핑을 할 때 onchange 발생 -> state를 바꿈 -> value가 바뀌는 로직 */
  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }
  const onNameHandler = (event) => {
    setName(event.currentTarget.value)
  }
  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value)
  }

  /* Form 제출 메소드 */
  const onsubmitHandler = (event) => {
    event.preventDefault(); // 페이지 리프레쉬를 막음.(원래 해놔야 하는 일들을 하는게 아니라)
    console.log('Email:', Email) // 이벤트로 넘어온거 확인
    console.log('Password:', Password)

    if (Password !== ConfirmPassword) {
      return alert('비밀번호와 비밀번호 확인은 같아야합니다.')
    }
    let body = {
      email: Email,
      name: Name,
      password: Password
    }

    // 적용: dispatch({type:액션타입})
    dispatch(registerUser(body)) //action을 취함
      .then(response => {
        if (response.payload.success) {
          props.history.push('/')
        } else {
          alert("Failed to sign up")
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
        <label>name</label>
        <input type="text" value={Name} onChange={onNameHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <label>Confirm Password</label>
        <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
        <br />
        <button type="submit">
          회원 가입
        </button>
      </form>
    </div>
  )
}

export default withRouter(RegisterPage)
