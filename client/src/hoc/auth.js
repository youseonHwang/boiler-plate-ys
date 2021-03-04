import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_actions';

// node.js에서 만들어놓은 auth 미들웨어 사용(token을 가져와서 유저를 찾고 role 확인)
// eslint-disable-next-line import/no-anonymous-default-export
export default function (SpecificComponent, option, adminRoute = null) {
  // option = null => 아무나 출입 가능
  // option = true => 로그인한
  // option = false => 로그인 안한
  // adminRoute = true => admin유저만 가능 (기본값은 null로 줬으니 안주면 null)
  function AuthenticationCheck(props) {

    const dispatch = useDispatch()

    useEffect(() => {
      dispatch(auth())
        .then(response => {
          console.log('useEffect에 입장')
          console.log(response)
          if (!response.payload.isAuth) { // 로그인하지 않은 상황
            console.log('로그인 하지 않은 상황')
            if (option) { //option이 true인 페이지에 접근시
              console.log('로그인 하지 않은 상황 -> option이 true인 페이지에 접근')
              props.history.push('/login') //로그인페이지로
            }
          } else { //로그인 한 상태
            console.log('로그인 한 상황')
            if (adminRoute && !response.payload.isAdmin) { // 어드민이 아닌데
              console.log('어드민 아닌데 어드민 페이지에')
              props.history.push('/')
            } else { //option이 false일때 (로그인 한 유저가 출입 불가능한)
              console.log('로그인 한 유저가 출입 불가능한데 출입하려고 함 ')
              if (option === false) {
                props.history.push('/')
              }
            }

          }
        })
    }, [])
    return (< SpecificComponent{...props} />)
  }

  return AuthenticationCheck
}

